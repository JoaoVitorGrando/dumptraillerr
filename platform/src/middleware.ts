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

/**
 * Middleware de autenticação e proteção de rotas.
 * Roda em todas as rotas configuradas no matcher abaixo.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Atualiza a sessão — IMPORTANTE: não remover
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Rotas protegidas — redireciona para login se não autenticado
  const protectedPrefixes = [
    "/dashboard/customer",
    "/dashboard/owner",
    "/dashboard/driver",
    "/admin",
  ];

  const isProtected = protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
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

  // Usuário logado tentando acessar páginas de auth — redireciona para dashboard do papel
  if (user && (path.startsWith("/auth/login") || path.startsWith("/auth/signup"))) {
    const role = normalizeRole(user.user_metadata?.role);
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
