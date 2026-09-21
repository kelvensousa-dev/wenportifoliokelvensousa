import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Gera chave no formato KELV-XXXX-XXXX-XXXX (sem caracteres ambiguos). */
function generateProductKey(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(12);
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
  return `KELV-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

/**
 * Marca o pedido como pago e gera as licencas, de forma IDEMPOTENTE.
 *
 * O Stripe reenvia webhooks (timeouts, retries). A versao anterior fazia
 * `update` cego: um reenvio repetia o processamento, e um pedido
 * inexistente gerava erro 500, fazendo o Stripe reenviar por ate 3 dias.
 */
async function fulfillOrder(session: Stripe.Checkout.Session) {
  const orderId = session.client_reference_id || session.metadata?.orderId;
  if (!orderId) {
    console.error('[WEBHOOK] Sessao sem orderId', session.id);
    return;
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) {
      console.error('[WEBHOOK] Pedido nao encontrado', orderId);
      return;
    }

    // Confere se o valor pago corresponde ao pedido (protege contra sessoes adulteradas).
    if (session.amount_total !== null && session.amount_total !== order.totalCents) {
      console.error('[WEBHOOK] Valor divergente', { orderId, pago: session.amount_total, esperado: order.totalCents });
      return;
    }

    // So avanca pedidos pendentes: garante idempotencia.
    const updated = await tx.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'PAID', providerId: session.id }
    });
    if (updated.count === 0 || !order.userId) return;

    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i += 1) {
        await tx.productKey.create({
          data: {
            key: generateProductKey(),
            userId: order.userId,
            productId: item.productId,
            orderId: order.id,
            deliveredAt: new Date()
          }
        });
      }
    }
  });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');

  if (!secret) {
    console.error('[WEBHOOK] STRIPE_WEBHOOK_SECRET nao configurada');
    return new NextResponse('Webhook nao configurado', { status: 500 });
  }
  if (!signature) {
    return new NextResponse('Assinatura ausente', { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    // Nao devolve a mensagem interna do erro ao chamador.
    console.error('[WEBHOOK] Assinatura invalida', error instanceof Error ? error.message : error);
    return new NextResponse('Assinatura invalida', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Metodos assincronos (boleto etc.) chegam aqui ainda "unpaid".
        if (session.payment_status === 'paid') await fulfillOrder(session);
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        await fulfillOrder(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.client_reference_id || session.metadata?.orderId;
        if (orderId) {
          await prisma.order.updateMany({ where: { id: orderId, status: 'PENDING' }, data: { status: 'CANCELED' } });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('[WEBHOOK] Falha ao processar', event.type, error);
    // 500 faz o Stripe tentar de novo — correto para falhas temporarias (ex.: banco fora).
    return new NextResponse('Erro ao processar', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
