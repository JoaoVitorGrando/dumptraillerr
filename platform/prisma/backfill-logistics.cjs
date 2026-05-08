const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const depotLabel = process.env.DEFAULT_DEPOT_LABEL || "FAGU Main Depot, Seattle, WA";
  const enabled = process.env.CONTINUOUS_LOGISTICS_ENABLED !== "false";

  console.log("[logistics-backfill] Starting...");
  console.log(`[logistics-backfill] Feature enabled: ${enabled}`);
  console.log(`[logistics-backfill] Default depot: ${depotLabel}`);

  const locationBackfill = await prisma.trailer.updateMany({
    where: { currentLocationAt: null },
    data: {
      currentLocationType: "DEPOT",
      currentLocationLabel: depotLabel,
      currentLocationAt: new Date(),
    },
  });

  console.log(`[logistics-backfill] Trailers with location backfilled: ${locationBackfill.count}`);

  if (!enabled) {
    console.log("[logistics-backfill] Continuous logistics disabled. Skipping order seeding.");
    return;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      logisticsOrders: { none: {} },
    },
    select: {
      id: true,
      trailerId: true,
      serviceDate: true,
      deliveryAddress: true,
      notes: true,
      trailer: { select: { currentLocationType: true, currentLocationLabel: true } },
    },
    take: 500,
  });

  let seeded = 0;
  for (const booking of bookings) {
    const providerMatch = booking.notes?.match(/provider=(OWNER|DRIVER_MARKETPLACE|CUSTOMER_PICKUP)/);
    const provider = providerMatch?.[1] || "DRIVER_MARKETPLACE";
    const fromLabel = booking.trailer.currentLocationLabel || depotLabel;
    const fromType = booking.trailer.currentLocationType || "DEPOT";

    const lastOrder = await prisma.logisticsOrder.findFirst({
      where: { trailerId: booking.trailerId },
      orderBy: { sequence: "desc" },
      select: { sequence: true },
    });
    const baseSequence = (lastOrder?.sequence || 0) + 1;

    await prisma.logisticsOrder.create({
      data: {
        trailerId: booking.trailerId,
        bookingId: booking.id,
        type: "PICKUP",
        status: "PENDING",
        sequence: baseSequence,
        fromLocationType: fromType,
        fromLocationLabel: fromLabel,
        toLocationType: "CUSTOMER_SITE",
        toLocationLabel: booking.deliveryAddress,
        requiresPickupTeam: provider === "DRIVER_MARKETPLACE",
        scheduledAt: booking.serviceDate,
        autoPlanned: true,
      },
    });

    await prisma.logisticsOrder.create({
      data: {
        trailerId: booking.trailerId,
        bookingId: booking.id,
        type: "DISPOSAL",
        status: "PENDING",
        sequence: baseSequence + 1,
        fromLocationType: "CUSTOMER_SITE",
        fromLocationLabel: booking.deliveryAddress,
        toLocationType: "IN_TRANSIT",
        toLocationLabel: "Seattle Transfer Station",
        wasteDropLocation: "Seattle Transfer Station",
        autoPlanned: true,
      },
    });

    seeded += 1;
  }

  console.log(`[logistics-backfill] Bookings with seeded logistics orders: ${seeded}`);
}

main()
  .catch((error) => {
    console.error("[logistics-backfill] Failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
