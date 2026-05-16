import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { seedLogisticsForConfirmedBooking } from "@/lib/logistics";

async function requireDriver() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const role = String(user.user_metadata?.role ?? "").toLowerCase();
  if (role !== "driver") {
    return { error: NextResponse.json({ error: "Only drivers can claim offers" }, { status: 403 }) };
  }

  const driver = await prisma.driverProfile.findFirst({
    where: { user: { email: user.email ?? "" }, approvedAt: { not: null } },
    select: { id: true },
  });
  if (!driver) {
    return {
      error: NextResponse.json(
        { error: "Driver not authorized yet" },
        { status: 403 }
      ),
    };
  }

  return { driverId: driver.id };
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireDriver();
  if ("error" in auth) return auth.error;

  const claim = await prisma.booking.updateMany({
    where: {
      id,
      status: "CONFIRMED",
      driverId: null,
    },
    data: {
      driverId: auth.driverId,
    },
  });

  if (claim.count === 0) {
    return NextResponse.json(
      { error: "Offer already claimed or unavailable" },
      { status: 409 }
    );
  }

  try {
    await seedLogisticsForConfirmedBooking(id);

    await prisma.logisticsOrder.updateMany({
      where: {
        bookingId: id,
        status: "PENDING",
        driverId: null,
      },
      data: {
        driverId: auth.driverId,
        status: "ASSIGNED",
      },
    });
  } catch {
    // Keep claim flow stable even if logistics schema is not deployed yet.
  }

  return NextResponse.json({ ok: true, bookingId: id, driverId: auth.driverId });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireDriver();
  if ("error" in auth) return auth.error;

  const release = await prisma.booking.updateMany({
    where: {
      id,
      status: "CONFIRMED",
      driverId: auth.driverId,
    },
    data: {
      driverId: null,
    },
  });

  if (release.count === 0) {
    return NextResponse.json(
      { error: "Delivery is no longer in cancellable state." },
      { status: 409 }
    );
  }

  await prisma.logisticsOrder.updateMany({
    where: {
      bookingId: id,
      driverId: auth.driverId,
      status: { in: ["ASSIGNED", "PENDING"] },
    },
    data: {
      driverId: null,
      status: "PENDING",
      startedAt: null,
    },
  });

  return NextResponse.json({ ok: true, bookingId: id });
}
