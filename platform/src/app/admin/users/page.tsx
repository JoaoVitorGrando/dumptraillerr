import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export const metadata = { title: "Users — Admin FAGU" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      ownerProfile: { select: { id: true, companyName: true, approvedAt: true } },
      driverProfile: { select: { id: true, licenseNumber: true, approvedAt: true } },
      customerProfile: { select: { id: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    ownerProfile: u.ownerProfile
      ? { ...u.ownerProfile, approvedAt: u.ownerProfile.approvedAt?.toISOString() ?? null }
      : null,
    driverProfile: u.driverProfile
      ? { ...u.driverProfile, approvedAt: u.driverProfile.approvedAt?.toISOString() ?? null }
      : null,
  }));

  return <UsersClient initialUsers={serialized} />;
}
