import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { AsaasError, createCustomer, createPayment, getPayment, isAsaasConfigured, PAID_STATUSES, toCents, updateCustomer } from '@/lib/asaas';
import { cancelPendingOrder, fulfillOrder } from '@/modules/billing/fulfillment';
import { isValidCpfCnpj, onlyDigits } from '@/lib/cpf-cnpj';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Checkout em REAIS via Asaas (Pix, boleto ou cartao nacional).
 *
 * Fluxo (espelha o do Stripe):
 *   1. cria/reaproveita o cliente no Asaas (exige CPF/CNPJ);
 *   2. cria o pedido PENDING no banco;
 *   3. cria a cobranca no Asaas ligada ao pedido (externalReference);
 *   4. devolve a URL da fatura hospedada pelo Asaas.
 * A liberacao da licenca acontece SOMENTE no webhook (/api/webhooks/asaas).
 */

const bodySchema = z.object({
  productSlug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  cpfCnpj: z.string().trim().max(20).optional()
});

/** Dias ate o vencimento. Pix e cartao sao instantaneos; o prazo serve ao boleto. */
const DUE_DAYS = 3;
/** Reaproveita a cobranca aberta do mesmo produto por ate 24h (evita cobranca duplicada por clique repetido). */
const REUSE_WINDOW_MS = 24 * 60 * 60 * 1000;

function appUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL;
  if (!url) throw new Error('NEXT_PUBLIC_APP_URL nao configurada.');
  return url.replace(/\/+$/, '');
}

/** Data de vencimento no fuso de Brasilia (o servidor roda em UTC). */
function dueDate(daysAhead: number): string {
  const date = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(date); // YYYY-MM-DD
}

function fail(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: Request) {
  let orderId: string | null = null;

  try {
    if (!isAsaasConfigured()) {
      console.error('[CHECKOUT_ASAAS] ASAAS_API_KEY nao configurada');
      return fail('Pagamento em reais indisponível no momento.', 503);
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return fail('Faça login para continuar.', 401);

    const limit = await rateLimit(`checkout:${session.user.id}`, 10, 10 * 60);
    if (!limit.allowed) return fail('Muitas tentativas. Aguarde alguns minutos.', 429);

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return fail('Dados inválidos.', 400);

    // O preco vem SEMPRE do banco. Nada que o navegador envie define valor.
    const product = await prisma.product.findUnique({ where: { slug: parsed.data.productSlug } });
    if (!product || !product.active) return fail('Produto indisponível.', 404);
    if (!product.priceBrlCents || product.priceBrlCents < 500) {
      // O Asaas nao aceita cobrancas abaixo de R$ 5,00.
      return fail('Este produto ainda não está disponível para pagamento em reais.', 409);
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return fail('Faça login para continuar.', 401);

    const cpfCnpj = parsed.data.cpfCnpj ? onlyDigits(parsed.data.cpfCnpj) : user.cpfCnpj;
    if (!cpfCnpj || !isValidCpfCnpj(cpfCnpj)) return fail('Informe um CPF ou CNPJ válido.', 400);

    // Clique repetido: devolve a fatura que ja esta aberta em vez de criar outra.
    const openOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        provider: 'asaas',
        status: 'PENDING',
        totalCents: product.priceBrlCents,
        paymentUrl: { not: null },
        createdAt: { gte: new Date(Date.now() - REUSE_WINDOW_MS) },
        items: { every: { productId: product.id } }
      },
      orderBy: { createdAt: 'desc' }
    });
    if (openOrder?.paymentUrl && openOrder.providerId && cpfCnpj === user.cpfCnpj) {
      // Antes de reaproveitar, confirma no Asaas que a cobranca ainda esta em aberto.
      // (Se o webhook atrasou ou nao chegou, a fatura pode ja estar paga.)
      const current = await getPayment(openOrder.providerId).catch(() => null);
      if (current && !current.deleted && (current.status === 'PENDING' || current.status === 'OVERDUE')) {
        return NextResponse.json({ url: openOrder.paymentUrl });
      }
      if (current && PAID_STATUSES.has(current.status)) {
        // Pagamento confirmado sem aviso do webhook: libera a licenca agora.
        // Leva o cliente a "Minhas compras" em vez de cobrar de novo.
        await fulfillOrder({ orderId: openOrder.id, provider: 'asaas', providerId: current.id, paidCents: toCents(current.value) });
        return NextResponse.json({ url: `${appUrl()}/dashboard/notificacoes` });
      } else if (current) {
        // Cobranca removida, estornada etc.: o pedido antigo nao vale mais.
        await cancelPendingOrder(openOrder.id);
      }
      // Cobranca inexistente/cancelada: segue o fluxo e cria uma nova.
    }

    // 1. Cliente no Asaas (criado uma vez e reaproveitado).
    const name = user.name?.trim() || user.email.split('@')[0];
    let customerId = user.asaasCustomerId;
    if (!customerId) {
      const customer = await createCustomer({ name, email: user.email, cpfCnpj, externalReference: user.id });
      customerId = customer.id;
    } else if (cpfCnpj !== user.cpfCnpj) {
      await updateCustomer(customerId, { cpfCnpj });
    }
    if (customerId !== user.asaasCustomerId || cpfCnpj !== user.cpfCnpj) {
      await prisma.user.update({ where: { id: user.id }, data: { asaasCustomerId: customerId, cpfCnpj } });
    }

    // 2. Pedido local.
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalCents: product.priceBrlCents,
        currency: 'BRL',
        status: 'PENDING',
        provider: 'asaas',
        reference: `KS-${randomUUID()}`,
        items: { create: { productId: product.id, unitCents: product.priceBrlCents, quantity: 1 } }
      }
    });
    orderId = order.id;

    // 3. Cobranca no Asaas ligada ao pedido.
    const redirect = process.env.ASAAS_SUCCESS_REDIRECT === 'true';
    const payment = await createPayment({
      customer: customerId,
      valueCents: product.priceBrlCents,
      dueDate: dueDate(DUE_DAYS),
      description: `${product.name} — licença comercial (pedido ${order.reference})`,
      externalReference: order.id,
      successUrl: redirect ? `${appUrl()}/dashboard/notificacoes?pagamento=recebido` : undefined
    });

    await prisma.order.update({ where: { id: order.id }, data: { providerId: payment.id, paymentUrl: payment.invoiceUrl } });

    // 4. O navegador segue para a fatura do Asaas.
    return NextResponse.json({ url: payment.invoiceUrl });
  } catch (error) {
    // Pedido criado sem cobranca nao deve ficar "aguardando pagamento" para sempre.
    if (orderId) {
      await prisma.order.updateMany({ where: { id: orderId, status: 'PENDING' }, data: { status: 'CANCELED' } }).catch(() => undefined);
    }
    if (error instanceof AsaasError) {
      console.error('[CHECKOUT_ASAAS]', error.message);
      if (error.status === 400 && error.errors.some((e) => /cpf|cnpj/i.test(`${e.code} ${e.description}`))) {
        return fail('O Asaas recusou o CPF/CNPJ informado. Confira o número.', 400);
      }
    } else {
      console.error('[CHECKOUT_ASAAS]', error);
    }
    return fail('Não foi possível iniciar o pagamento.', 500);
  }
}
