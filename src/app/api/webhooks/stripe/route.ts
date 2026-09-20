import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Pegar ID do pedido pelo metadata ou client_reference_id
    const orderId = session.client_reference_id || session.metadata?.orderId;

    if (!orderId) {
      console.error("No order ID found in session");
      return new NextResponse("No order ID", { status: 400 });
    }

    // Atualizar status do pedido no banco de dados
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "PAID",
      },
      include: {
        items: true,
      }
    });

    // FUTURO: Se o produto envolver chaves (ProductKey), gerá-las aqui.
    console.log(`Order ${order.id} paid successfully!`);
  }

  return new NextResponse(null, { status: 200 });
}
