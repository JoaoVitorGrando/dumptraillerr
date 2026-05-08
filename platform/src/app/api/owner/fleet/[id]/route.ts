import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/owner/fleet/[id]
 *
 * Owner-only. Atualiza propriedades operacionais de um trailer da própria frota.
 * Body atualmente suportado:
 *   { onlineBookingEnabled: boolean }
 *
 * Não permite alterar trailer de outro owner (403).
 */
const PatchSchema = z
  .object({
    onlineBookingEnabled: z.boolean().optional(),
    name: z.string().min(2).max(120).optional(),
    size: z.string().min(2).max(40).optional(),
    pricePerPeriod: z.number().int().positive().optional(),
    currentLocationType: z
      .enum(["DEPOT", "CUSTOMER_SITE", "DISPOSAL_SITE", "IN_TRANSIT", "UNKNOWN"])
      .optional(),
    currentLocationLabel: z.string().max(240).nullable().optional(),
  })
  .strict();

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (user.user_metadata?.role as string | undefined)?.toLowerCase();
  if (role !== "owner" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Garantir ownership do trailer (admin pula essa checagem)
  const trailer = await prisma.trailer.findUnique({
    where: { id },
    select: {
      id: true,
      ownerId: true,
      onlineBookingEnabled: true,
      owner: { select: { user: { select: { email: true } } } },
    },
  });

  if (!trailer) {
    return NextResponse.json({ error: "Trailer not found" }, { status: 404 });
  }

  if (role === "owner" && trailer.owner?.user?.email !== user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = parsed.data;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Empty patch" }, { status: 400 });
  }

  const previous = {
    onlineBookingEnabled: trailer.onlineBookingEnabled,
  };

  const updated = await prisma.trailer.update({
    where: { id },
    data: {
      ...data,
      ...(data.currentLocationType || data.currentLocationLabel !== undefined
        ? { currentLocationAt: new Date() }
        : {}),
    },
    select: {
      id: true,
      name: true,
      size: true,
      pricePerPeriod: true,
      onlineBookingEnabled: true,
      currentLocationType: true,
      currentLocationLabel: true,
    },
  });

  // Audit log (best-effort, não bloqueia o request)
  if (
    data.onlineBookingEnabled !== undefined &&
    data.onlineBookingEnabled !== previous.onlineBookingEnabled
  ) {
    prisma.auditLog
      .create({
        data: {
          actorId: user.id,
          action: "trailer.onlineBookingToggle",
          entity: "trailer",
          entityId: id,
          payload: {
            from: previous.onlineBookingEnabled,
            to: data.onlineBookingEnabled,
          },
        },
      })
      .catch(() => {
        /* swallow */
      });
  }

  if (
    data.name !== undefined ||
    data.size !== undefined ||
    data.pricePerPeriod !== undefined ||
    data.currentLocationType !== undefined ||
    data.currentLocationLabel !== undefined
  ) {
    prisma.auditLog
      .create({
        data: {
          actorId: user.id,
          action: "trailer.ownerUpdate",
          entity: "trailer",
          entityId: id,
          payload: {
            name: data.name,
            size: data.size,
            pricePerPeriod: data.pricePerPeriod,
            currentLocationType: data.currentLocationType,
            currentLocationLabel: data.currentLocationLabel,
          },
        },
      })
      .catch(() => {
        /* swallow */
      });
  }

  return NextResponse.json(updated);
}
