import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/config/env";

/**
 * Cliente Supabase para uso no browser (Client Components).
 * Use este cliente apenas em arquivos marcados com "use client".
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
