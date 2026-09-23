import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { cancelPendingOrder, fulfillOrder } from '@/modules/billing/fulfillment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Webhook do Stripe (cartao internacional, US$).
 * A regra de pedido/licenca fica em src/modules/billing/fulfillment.ts,
 * compartilhada com o webhook do Asaas.
 */
function orderIdOf(session: Stripe.Checkout.Session): string | null {
  return session.client_reference_id || session.metadata?.orderId || null;
}

async function handlePaid(session: Stripe.Checkout.Session) {
  const orderId = orderIdOf(session);
  if (!orderId) {
    console.error('[WEBHOOK_STRIPE] Sessao sem orderId', session.id);
    return;
  }
  const result = await fulfillOrder({ orderId, provider: 'stripe', providerId: session.id, paidCents: session.amount_total });
  if (result !== 'fulfilled' && result !== 'already_processed') {
    console.error('[WEBHOOK_STRIPE] Pedido nao liberado', { orderId, result });
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');

  if (!secret) {
    console.error('[WEBHOOK_STRIPE] STRIPE_WEBHOOK_SECRET nao configurada');
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
    console.error('[WEBHOOK_STRIPE] Assinatura invalida', error instanceof Error ? error.message : error);
    return new NextResponse('Assinatura invalida', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Metodos assincronos chegam aqui ainda "unpaid".
        if (session.payment_status === 'paid') await handlePaid(session);
        break;
      }
      case 'checkout.session.async_payment_succeeded':
        await handlePaid(event.data.object as Stripe.Checkout.Session);
        break;
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const orderId = orderIdOf(event.data.object as Stripe.Checkout.Session);
        if (orderId) await cancelPendingOrder(orderId);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('[WEBHOOK_STRIPE] Falha ao processar', event.type, error);
    // 500 faz o Stripe tentar de novo — correto para falhas temporarias (ex.: banco fora).
    return new NextResponse('Erro ao processar', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
