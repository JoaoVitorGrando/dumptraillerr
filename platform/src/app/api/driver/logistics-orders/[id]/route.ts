import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createNextRouteAfterDisposal } from "@/lib/logistics";

type Action = "start" | "complete" | "cancel";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { action?: Action };
  const action = body.action;

  if (!action || !["start", "complete", "cancel"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 422 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = String(user.user_metadata?.role ?? "").toLowerCase();
  if (role !== "driver") {
    return NextResponse.json({ error: "Only drivers can update logistics orders" }, { status: 403 });
  }

  const driver = await prisma.driverProfile.findFirst({
    where: { user: { email: user.email ?? "" } },
    select: { id: true },
  });
  if (!driver) {
    return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
  }

  const order = await prisma.logisticsOrder.findUnique({
    where: { id },
    select: {
      id: true,
      trailerId: true,
      bookingId: true,
      status: true,
      type: true,
      toLocationType: true,
      toLocationLabel: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (action === "start") {
    const updated = await prisma.logisticsOrder.update({
      where: { id: order.id },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
        driverId: driver.id,
      },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, order: updated });
  }

  if (action === "cancel") {
    const updated = await prisma.logisticsOrder.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, order: updated });
  }

  const completed = await prisma.logisticsOrder.update({
    where: { id: order.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      driverId: driver.id,
    },
    select: { id: true, status: true },
  });

  await prisma.trailer.update({
    where: { id: order.trailerId },
    data: {
      currentLocationType: order.toLocationType,
      currentLocationLabel: order.toLocationLabel,
      currentLocationRefId: order.bookingId ?? null,
      currentLocationAt: new Date(),
    },
  });

  if (order.type === "DISPOSAL") {
    await createNextRouteAfterDisposal({
      trailerId: order.trailerId,
      fromBookingId: order.bookingId,
      driverId: driver.id,
    });
  }

  const nextOrder = await prisma.logisticsOrder.findFirst({
    where: {
      trailerId: order.trailerId,
      status: "PENDING",
    },
    orderBy: { sequence: "asc" },
    select: {
      id: true,
      type: true,
      toLocationLabel: true,
      bookingId: true,
    },
  });

  return NextResponse.json({ ok: true, order: completed, nextOrder });
}
