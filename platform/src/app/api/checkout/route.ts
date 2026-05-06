import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/checkout
 * Cria uma Stripe Checkout Session para um booking.
 *
 * Body: { trailerName, trailerSize, deliveryDate, pickupDate, days, totalCents, customerEmail }
 *
 * Quando STRIPE_SECRET_KEY estiver configurado → cria sessão real.
 * Sem a chave → modo demo, redireciona direto para /booking/success.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    trailerName,
    trailerSize,
    deliveryDate,
    pickupDate,
    days,
    totalCents,
    customerEmail,
    cancelUrl,
  } = body as {
    trailerName: string;
    trailerSize: string;
    deliveryDate: string;
    pickupDate: string;
    days: number;
    totalCents: number;
    customerEmail?: string;
    cancelUrl?: string;
  };

  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const successUrl = `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
  const finalCancelUrl = cancelUrl ?? `${origin}/services/dump-trailer`;

  // ── MODO DEMO (sem Stripe key) ──────────────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    const demoId = `demo_${Date.now()}`;
    return NextResponse.json({
      url: `${origin}/booking/success?session_id=${demoId}&demo=true`,
      sessionId: demoId,
      demo: true,
    });
  }

  // ── MODO REAL (com Stripe key) ──────────────────────────────────────────
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${trailerName} (${trailerSize})`,
              description: `Dump trailer rental · ${days} day${days > 1 ? "s" : ""} · Delivery: ${deliveryDate} · Pickup: ${pickupDate}`,
              images: [`${origin}/assets/dumptrailler-header.jpg`],
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        trailerSize,
        deliveryDate,
        pickupDate,
        days: String(days),
      },
      success_url: successUrl,
      cancel_url: finalCancelUrl,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
