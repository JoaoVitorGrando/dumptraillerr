import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to requested page (or home if invalid)
      const safe = redirectTo.startsWith("/") ? redirectTo : "/";
      return NextResponse.redirect(`${origin}${safe}`);
    }
  }

  // Failed — send to login with error flag
  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
}
