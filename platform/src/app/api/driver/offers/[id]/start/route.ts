import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = String(user.user_metadata?.role ?? "").toLowerCase();
  if (role !== "driver") {
    return NextResponse.json({ error: "Only drivers can start routes" }, { status: 403 });
  }

  const driver = await prisma.driverProfile.findFirst({
    where: { user: { email: user.email ?? "" }, approvedAt: { not: null } },
    select: { id: true },
  });
  if (!driver) {
    return NextResponse.json(
      { error: "Driver not authorized yet" },
      { status: 403 }
    );
  }

  const startResult = await prisma.booking.updateMany({
    where: {
      id,
      driverId: driver.id,
      status: "CONFIRMED",
    },
    data: {
      status: "IN_PROGRESS",
    },
  });

  if (startResult.count === 0) {
    return NextResponse.json(
      { error: "Route already started or not assigned to this driver." },
      { status: 409 }
    );
  }

  await prisma.logisticsOrder.updateMany({
    where: {
      bookingId: id,
      driverId: driver.id,
      status: { in: ["ASSIGNED", "PENDING"] },
    },
    data: {
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, bookingId: id, driverId: driver.id });
}
