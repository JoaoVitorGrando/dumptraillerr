import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const users = await prisma.user.findMany({
      where: {
        ...(role && role !== "all" ? { role: role.toUpperCase() as never } : {}),
        ...(status && status !== "all" ? { status: status.toUpperCase() as never } : {}),
        role: { not: "ADMIN" },
      },
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

    return NextResponse.json(users);
  } catch (err) {
    return adminError(err);
  }
}
