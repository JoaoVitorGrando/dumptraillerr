import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

type UserRole = "customer" | "owner" | "driver" | "admin";

function normalizeRole(value: unknown): UserRole {
  const role = String(value ?? "").toLowerCase();
  if (role === "owner" || role === "driver" || role === "admin") return role;
  return "customer";
}

function getRoleHome(role: UserRole) {
  if (role === "admin") return "/admin";
  return `/dashboard/${role}`;
}

const PROTECTED_PREFIXES = [
  "/dashboard/customer",
  "/dashboard/owner",
  "/dashboard/driver",
  "/admin",
] as const;

function redirectToLogin(request: NextRequest, path: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set("redirectTo", `${path}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

/** Sem Supabase configurado: site público abre; rotas protegidas vão para login. */
function handleWithoutSupabase(request: NextRequest, path: string) {
  if (PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return redirectToLogin(request, path);
  }
  return NextResponse.next({ request });
}

/**
 * Middleware de autenticação e proteção de rotas.
 * Roda em todas as rotas configuradas no matcher abaixo.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Admin API routes validate auth/role in their own handlers.
  // Skipping middleware auth avoids duplicate Supabase round-trips per action.
  if (path.startsWith("/api/admin/")) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return handleWithoutSupabase(request, path);
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Atualiza a sessão — IMPORTANTE: não remover
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isProtected = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));

    if (isProtected && !user) {
      return redirectToLogin(request, path);
    }

    if (user) {
      const role = normalizeRole(user.user_metadata?.role);
      const roleHome = getRoleHome(role);

      if (path === "/dashboard") {
        return NextResponse.redirect(new URL(roleHome, request.url));
      }

      if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(roleHome, request.url));
      }

      if (path.startsWith("/dashboard/customer") && role !== "customer") {
        return NextResponse.redirect(new URL(roleHome, request.url));
      }

      if (path.startsWith("/dashboard/owner") && role !== "owner") {
        return NextResponse.redirect(new URL(roleHome, request.url));
      }

      if (path.startsWith("/dashboard/driver") && role !== "driver") {
        return NextResponse.redirect(new URL(roleHome, request.url));
      }
    }

    if (user && (path.startsWith("/auth/login") || path.startsWith("/auth/signup"))) {
      const role = normalizeRole(user.user_metadata?.role);
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }

    return supabaseResponse;
  } catch {
    return handleWithoutSupabase(request, path);
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
