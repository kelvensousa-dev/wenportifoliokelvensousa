import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AsaasError, getPayment, PAID_STATUSES, toCents } from '@/lib/asaas';
import { cancelPendingOrder, fulfillOrder, revokePaidOrder } from '@/modules/billing/fulfillment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Webhook do Asaas.
 *
 * Seguranca:
 *  - Autenticacao pelo header `asaas-access-token` (comparacao em tempo constante).
 *  - O corpo do webhook NAO e confiavel sozinho: o status e o valor sao
 *    reconsultados na API do Asaas (GET /payments/:id) antes de liberar algo.
 *
 * Confiabilidade:
 *  - Idempotencia pelo `id` do evento (tabela WebhookEvent).
 *  - Respostas 200 para eventos que nao nos dizem respeito: o Asaas PAUSA a
 *    fila de webhooks depois de 15 falhas seguidas, entao so devolvemos erro
 *    (500) em falhas temporarias, quando uma nova tentativa faz sentido.
 */

const PAID_EVENTS = new Set(['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED']);
const CANCEL_EVENTS = new Set(['PAYMENT_DELETED', 'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', 'PAYMENT_REPROVED_BY_RISK_ANALYSIS']);
const REVOKE_EVENTS = new Set(['PAYMENT_REFUNDED', 'PAYMENT_CHARGEBACK_REQUESTED']);

type WebhookBody = {
  id?: string;
  event?: string;
  payment?: { id?: string; externalReference?: string | null };
};

function validToken(received: string | null): boolean {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!expected || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const ok = () => NextResponse.json({ received: true });

export async function POST(req: Request) {
  if (!process.env.ASAAS_WEBHOOK_TOKEN) {
    console.error('[WEBHOOK_ASAAS] ASAAS_WEBHOOK_TOKEN nao configurada');
    return new NextResponse('Webhook nao configurado', { status: 500 });
  }
  if (!validToken(req.headers.get('asaas-access-token'))) {
    return new NextResponse('Nao autorizado', { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as WebhookBody | null;
  const eventId = body?.id;
  const eventType = body?.event;
  const paymentId = body?.payment?.id;
  if (!eventId || !eventType) return new NextResponse('Payload invalido', { status: 400 });

  const relevant = PAID_EVENTS.has(eventType) || CANCEL_EVENTS.has(eventType) || REVOKE_EVENTS.has(eventType);
  if (!relevant || !paymentId) return ok();

  // Evento ja processado? (reenvio do Asaas)
  const seen = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (seen) return ok();

  try {
    // So confia no que a API do Asaas diz, nao no corpo recebido.
    const payment = await getPayment(paymentId);

    const order = await prisma.order.findFirst({
      where: {
        provider: 'asaas',
        OR: [{ providerId: payment.id }, ...(payment.externalReference ? [{ id: payment.externalReference }] : [])]
      },
      select: { id: true }
    });

    if (!order) {
      // Cobranca criada fora do site (ex.: manualmente no painel do Asaas).
      console.warn('[WEBHOOK_ASAAS] Cobranca sem pedido local', { eventType, paymentId });
    } else if (PAID_EVENTS.has(eventType)) {
      if (PAID_STATUSES.has(payment.status)) {
        const result = await fulfillOrder({ orderId: order.id, provider: 'asaas', providerId: payment.id, paidCents: toCents(payment.value) });
        if (result !== 'fulfilled' && result !== 'already_processed') {
          console.error('[WEBHOOK_ASAAS] Pedido nao liberado', { orderId: order.id, result, paymentId });
        }
      }
    } else if (CANCEL_EVENTS.has(eventType)) {
      await cancelPendingOrder(order.id);
    } else if (REVOKE_EVENTS.has(eventType)) {
      await revokePaidOrder(order.id);
      console.warn('[WEBHOOK_ASAAS] Licencas revogadas', { orderId: order.id, eventType });
    }

    await prisma.webhookEvent.create({ data: { id: eventId, provider: 'asaas', type: eventType } }).catch((error) => {
      // Duas entregas simultaneas do mesmo evento: a outra ja registrou. As
      // operacoes acima sao idempotentes, entao nao ha efeito duplicado.
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) throw error;
    });

    return ok();
  } catch (error) {
    if (error instanceof AsaasError && error.status === 404) {
      console.warn('[WEBHOOK_ASAAS] Cobranca inexistente na API', paymentId);
      return ok();
    }
    console.error('[WEBHOOK_ASAAS] Falha ao processar', eventType, error instanceof Error ? error.message : error);
    // Falha temporaria (banco ou API fora): o Asaas tentara de novo.
    return new NextResponse('Erro ao processar', { status: 500 });
  }
}
