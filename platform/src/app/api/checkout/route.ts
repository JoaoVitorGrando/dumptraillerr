import { NextRequest, NextResponse } from "next/server";
import { DEMO_BOOKINGS_COOKIE, type StoredDemoBooking } from "@/lib/demoBookings";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { checkTrailerAvailability } from "@/lib/availability";

/**
 * POST /api/checkout
 * Cria uma Stripe Checkout Session + Booking PENDING no banco.
 *
 * Body obrigatório: { trailerName, trailerSize, deliveryDate, pickupDate, days, totalCents }
 * Body opcional com DB: { trailerId } — ativa integração Prisma + checagem de conflito
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
    address,
    city,
    notes,
    trailerImage,
    trailerId,
    deliveryWindow,
    materialType,
    loads,
  } = body as {
    trailerName: string;
    trailerSize: string;
    deliveryDate: string;
    pickupDate: string;
    days: number;
    totalCents: number;
    customerEmail?: string;
    cancelUrl?: string;
    address?: string;
    city?: string;
    notes?: string;
    trailerImage?: string;
    trailerId?: string;
    deliveryWindow?: string;
    materialType?: string;
    loads?: string;
  };

  const origin = request.headers.get("origin") ?? "http://localhost:3000";
  const successUrl = `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
  const finalCancelUrl = cancelUrl ?? `${origin}/services/dump-trailer`;

  // ── Tentar integração com Prisma (quando trailerId disponível) ──────────
  let prismaBookingId: string | null = null;

  if (trailerId) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const serviceDate = new Date(deliveryDate);
        const pickupDateObj = pickupDate ? new Date(pickupDate) : new Date(serviceDate.getTime() + days * 86400000);

        const customerProfile = await prisma.customerProfile.findFirst({
          where: { user: { email: user.email ?? "" } },
          select: { id: true },
        });

        if (customerProfile) {
          const { available, conflictingBookingIds, conflictingBlockIds } =
            await checkTrailerAvailability(trailerId, serviceDate, pickupDateObj);

          if (!available) {
            return NextResponse.json(
              {
                error: "Trailer not available for the selected dates",
                conflicts: { bookings: conflictingBookingIds, blocks: conflictingBlockIds },
              },
              { status: 409 }
            );
          }

          const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

          const booking = await prisma.booking.create({
            data: {
              customerId: customerProfile.id,
              trailerId,
              status: "PENDING",
              deliveryAddress: address ?? "",
              serviceDate,
              pickupDate: pickupDateObj,
              deliveryWindow: deliveryWindow ?? "afternoon",
              materialType: materialType ?? "other",
              loads: loads ?? String(days),
              totalAmount: totalCents,
              notes,
              expiresAt,
              payment: {
                create: { amount: totalCents, status: "PENDING" },
              },
            },
            select: { id: true },
          });

          prismaBookingId = booking.id;
        }
      }
    } catch {
      // Falha silenciosa — continua com modo demo
    }
  }

  // ── Helpers para cookie demo ──────────────────────────────────────────
  const parseCookieBookings = (): StoredDemoBooking[] => {
    const existingRaw = request.cookies.get(DEMO_BOOKINGS_COOKIE)?.value;
    if (!existingRaw) return [];
    try {
      const parsed = JSON.parse(existingRaw) as StoredDemoBooking[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const persistBookingInCookie = (
    response: NextResponse,
    bookingId: string,
    paymentStatus: "paid" | "pending"
  ) => {
    if (!customerEmail) return;
    const existing = parseCookieBookings();
    const booking: StoredDemoBooking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: paymentStatus === "paid" ? "confirmed" : "pending",
      paymentStatus,
      totalAmount: totalCents,
      deliveryDate,
      pickupDate,
      address: address || "Address not provided",
      city: city || "Seattle, WA",
      notes: notes || "",
      customerEmail,
      trailer: {
        name: trailerName || "Dump Trailer",
        size: trailerSize || "custom",
        image: trailerImage || "/assets/7x14.png",
      },
    };

    const next = [booking, ...existing.filter((b) => b.id !== bookingId)].slice(0, 60);
    response.cookies.set(DEMO_BOOKINGS_COOKIE, JSON.stringify(next), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  };

  const missingKeys: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missingKeys.push("STRIPE_SECRET_KEY");

  // ── MODO DEMO (sem Stripe key) ──────────────────────────────────────────
  if (missingKeys.length > 0) {
    const demoId = prismaBookingId ?? `demo_${Date.now()}`;
    const response = NextResponse.json({
      url: `${origin}/booking/success?session_id=${demoId}&demo=true`,
      sessionId: demoId,
      demo: true,
      missingKeys,
    });

    persistBookingInCookie(response, demoId, "paid");

    // Se temos booking no DB, marca como paid imediatamente no demo
    if (prismaBookingId) {
      prisma.payment
        .update({
          where: { bookingId: prismaBookingId },
          data: { status: "PAID", paidAt: new Date() },
        })
        .then(() =>
          prisma.booking.update({
            where: { id: prismaBookingId! },
            data: { status: "CONFIRMED", expiresAt: null },
          })
        )
        .catch(() => {});
    }

    return response;
  }

  // ── MODO REAL (com Stripe key) ──────────────────────────────────────────
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
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
        bookingId: prismaBookingId ?? "",
      },
      success_url: successUrl,
      cancel_url: finalCancelUrl,
    });

    // Associar stripeCheckoutSessionId ao Payment no banco
    if (prismaBookingId && session.id) {
      prisma.payment
        .update({
          where: { bookingId: prismaBookingId },
          data: { stripeCheckoutSessionId: session.id },
        })
        .catch(() => {});
    }

    const response = NextResponse.json({ url: session.url, sessionId: session.id });
    persistBookingInCookie(response, session.id, "paid");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
