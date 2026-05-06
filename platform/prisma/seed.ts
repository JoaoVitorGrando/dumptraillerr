import {
  BookingStatus,
  PrismaClient,
  TrailerStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@fagu.com" },
    update: {},
    create: {
      email: "owner@fagu.com",
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@fagu.com" },
    update: {},
    create: {
      email: "customer@fagu.com",
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  const ownerProfile = await prisma.ownerProfile.upsert({
    where: { userId: ownerUser.id },
    update: {},
    create: {
      userId: ownerUser.id,
      companyName: "Fagu Demo LLC",
    },
  });

  const customerProfile = await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      preferredAddress: "Seattle, WA",
    },
  });

  const trailer = await prisma.trailer.upsert({
    where: { slug: "dump-trailer-demo" },
    update: {},
    create: {
      ownerId: ownerProfile.id,
      name: "Dump Trailer Demo",
      slug: "dump-trailer-demo",
      size: "14ft",
      capacity: "14 yd",
      gvwr: "14000 lb",
      payload: "10000 lb",
      pricePerPeriod: 45000,
      status: TrailerStatus.AVAILABLE,
      images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be"],
    },
  });

  const existingBooking = await prisma.booking.findFirst({
    where: {
      customerId: customerProfile.id,
      trailerId: trailer.id,
      notes: "Seed demo booking",
    },
  });

  if (!existingBooking) {
    await prisma.booking.create({
      data: {
        customerId: customerProfile.id,
        trailerId: trailer.id,
        status: BookingStatus.CONFIRMED,
        deliveryAddress: "123 Pine St, Seattle, WA",
        serviceDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        deliveryWindow: "08:00-10:00",
        materialType: "Construction debris",
        loads: "1",
        totalAmount: 45000,
        notes: "Seed demo booking",
      },
    });
  }

  console.log("Seed concluido com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
