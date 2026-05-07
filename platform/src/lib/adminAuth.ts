import { createClient } from "./supabase/server";
import { NextResponse } from "next/server";

export interface AdminAuthResult {
  userId: string;
  supabaseId: string;
}

/**
 * Verifica se o request é de um admin autenticado.
 * Lança um NextResponse 401/403 se não autorizado.
 * Retorna o userId do admin para uso em audit logs.
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }

  const role = user.user_metadata?.role as string | undefined;
  if (role !== "admin") {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }

  return { userId: user.id, supabaseId: user.id };
}

export function adminError(err: unknown): NextResponse {
  const e = err as { message?: string; status?: number };
  const status = e.status ?? 500;
  const message = e.message ?? "Internal server error";
  return NextResponse.json({ error: message }, { status });
}
