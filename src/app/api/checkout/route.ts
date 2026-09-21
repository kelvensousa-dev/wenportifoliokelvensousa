import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  productSlug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/)
});

function appUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL;
  if (!url) throw new Error('NEXT_PUBLIC_APP_URL nao configurada.');
  return url.replace(/\/+$/, '');
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Faca login para continuar.' }, { status: 401 });
    }

    const limit = await rateLimit(`checkout:${session.user.id}`, 10, 10 * 60);
    if (!limit.allowed) {
      return NextResponse.json({ message: 'Muitas tentativas. Aguarde alguns minutos.' }, { status: 429 });
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ message: 'Produto invalido.' }, { status: 400 });
    }

    // O preco vem SEMPRE do banco. Nada que o navegador envie define valor.
    const product = await prisma.product.findUnique({ where: { slug: parsed.data.productSlug } });
    if (!product || !product.active) {
      return NextResponse.json({ message: 'Produto indisponivel.' }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalCents: product.priceCents,
        currency: product.currency,
        status: 'PENDING',
        provider: 'stripe',
        reference: `KS-${randomUUID()}`,
        items: {
          create: { productId: product.id, unitCents: product.priceCents, quantity: 1 }
        }
      }
    });

    const baseUrl = appUrl();
    const stripeSession = await getStripe().checkout.sessions.create(
      {
        mode: 'payment',
        // Rota antiga era /products/... (inexistente -> 404 ao cancelar).
        success_url: `${baseUrl}/dashboard?success=true`,
        cancel_url: `${baseUrl}/checkout?produto=${encodeURIComponent(product.slug)}&canceled=true`,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer_email: session.user.email ?? undefined,
        client_reference_id: order.id,
        line_items: [
          {
            price_data: {
              currency: product.currency.toLowerCase(),
              product_data: { name: product.name, description: product.description.slice(0, 500) },
              unit_amount: product.priceCents
            },
            quantity: 1
          }
        ],
        metadata: { orderId: order.id, productId: product.id }
      },
      // Evita cobrar duas vezes se a requisicao for repetida pela rede.
      { idempotencyKey: `order-${order.id}` }
    );

    await prisma.order.update({ where: { id: order.id }, data: { providerId: stripeSession.id } });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return NextResponse.json({ message: 'Nao foi possivel iniciar o pagamento.' }, { status: 500 });
  }
}
