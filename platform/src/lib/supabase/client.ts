import { createBrowserClient, type CookieOptions } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no browser (Client Components).
 * Use este cliente apenas em arquivos marcados com "use client".
 *
 * Durante o build (sem env vars) retornamos um proxy que só falha quando
 * algum método é realmente chamado. Isso permite que páginas client-only
 * sejam pre-renderizadas sem env e, em runtime no browser, o cliente real
 * é instanciado com as variáveis injetadas pelo Next.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Proxy({} as ReturnType<typeof createBrowserClient>, {
      get() {
        throw new Error(
          "Supabase client env vars ausentes: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
      },
    });
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Reexporta o tipo para compatibilidade quando precisarmos tipar cookies handlers.
export type { CookieOptions };
