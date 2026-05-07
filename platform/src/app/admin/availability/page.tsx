import { prisma } from "@/lib/prisma";
import AvailabilityClient from "./AvailabilityClient";

export const metadata = { title: "Availability — Admin FAGU" };

export default async function AdminAvailabilityPage() {
  const [blocks, trailers] = await Promise.all([
    prisma.trailerAvailability.findMany({
      orderBy: { blockedFrom: "asc" },
      select: {
        id: true,
        trailerId: true,
        blockedFrom: true,
        blockedUntil: true,
        reason: true,
        trailer: { select: { name: true } },
      },
    }),
    prisma.trailer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const serialized = blocks.map((b) => ({
    ...b,
    blockedFrom: b.blockedFrom.toISOString(),
    blockedUntil: b.blockedUntil.toISOString(),
  }));

  return <AvailabilityClient initialBlocks={serialized} trailers={trailers} />;
}
