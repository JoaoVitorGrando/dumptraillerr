import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedLogisticsForConfirmedBooking } from "@/lib/logistics";

/**
 * POST /api/webhooks/stripe
 * Recebe eventos do Stripe e atualiza Booking + Payment no banco.
 */
export async function POST(request: NextRequest) {
  const missingKeys: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missingKeys.push("STRIPE_SECRET_KEY");
  if (!process.env.STRIPE_WEBHOOK_SECRET) missingKeys.push("STRIPE_WEBHOOK_SECRET");

  if (missingKeys.length > 0) {
    return NextResponse.json({ received: true, demo: true, missingKeys });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;

        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as import("stripe").Stripe.PaymentIntent;
        await handlePaymentFailed(intent.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function handleCheckoutCompleted(
  session: import("stripe").Stripe.Checkout.Session
) {
  const sessionId = session.id;

  // Idempotência: verificar se já foi processado
  const payment = await prisma.payment.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
    select: { id: true, bookingId: true, status: true },
  });

  if (!payment) {
    console.warn("Payment record not found for session:", sessionId);
    return;
  }

  if (payment.status === "PAID") {
    console.warn("Already processed:", sessionId);
    return;
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent as string | null,
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED", expiresAt: null },
    }),
  ]);

  try {
    await seedLogisticsForConfirmedBooking(payment.bookingId);
  } catch (err) {
    console.warn("Could not seed logistics for booking:", payment.bookingId, err);
  }

  console.warn("Booking confirmed:", payment.bookingId);
}

async function handlePaymentFailed(paymentIntentId: string) {
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    select: { id: true, bookingId: true },
  });

  if (!payment) return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });

  console.warn("Payment failed for booking:", payment.bookingId);
}

export const config = {
  api: { bodyParser: false },
};
