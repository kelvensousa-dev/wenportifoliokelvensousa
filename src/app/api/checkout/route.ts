import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // Assuming prisma is exported from here

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Criar um Order pendente no banco de dados
    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        totalCents: product.priceCents,
        currency: product.currency,
        status: "PENDING",
        provider: "stripe",
        reference: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: {
          create: {
            productId: product.id,
            unitCents: product.priceCents,
            quantity: 1,
          },
        },
      },
    });

    // Criar Sessão do Checkout no Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}?canceled=true`,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "required",
      customer_email: session.user.email || undefined,
      client_reference_id: order.id,
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id,
        productId: product.id,
      },
    });

    // Atualizar Order com o ID da sessão do Stripe
    await prisma.order.update({
      where: { id: order.id },
      data: { providerId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
