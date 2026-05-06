import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhooks/stripe
 * Recebe eventos do Stripe e executa ações no banco.
 *
 * Configurar no Stripe Dashboard:
 *   Endpoint URL: https://seudominio.com/api/webhooks/stripe
 *   Eventos: checkout.session.completed, payment_intent.payment_failed
 *
 * Variáveis necessárias:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET   (via `stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
 */
export async function POST(request: NextRequest) {
  // Sem credenciais → apenas confirma recebimento (desenvolvimento)
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, demo: true });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia",
    });

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        // TODO: criar booking no Supabase
        // await createBooking({
        //   stripeSessionId: session.id,
        //   customerEmail: session.customer_email,
        //   trailerSize: session.metadata?.trailerSize,
        //   deliveryDate: session.metadata?.deliveryDate,
        //   pickupDate: session.metadata?.pickupDate,
        //   amountPaid: session.amount_total,
        // });
        console.log("✅ Booking confirmed:", session.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as import("stripe").Stripe.PaymentIntent;
        // TODO: notificar cliente via GHL/email
        console.log("❌ Payment failed:", intent.id);
        break;
      }

      default:
        // Evento não tratado — OK
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Desabilitar body parsing do Next.js — Stripe precisa do raw body para verificar assinatura
export const config = {
  api: { bodyParser: false },
};
