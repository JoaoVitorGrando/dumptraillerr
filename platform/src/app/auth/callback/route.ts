import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
 * OAuth / Magic Link callback handler.
 * Supabase redirects here after the user clicks the email link.
 * We exchange the `code` for a session, then redirect the user.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safe = redirectTo.startsWith("/") ? redirectTo : "/";
      if (safe !== "/") {
        return NextResponse.redirect(`${origin}${safe}`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const role = normalizeRole(user?.user_metadata?.role);
      return NextResponse.redirect(`${origin}${getRoleHome(role)}`);
    }
  }

  // Failed — send to login with error flag
  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
}
