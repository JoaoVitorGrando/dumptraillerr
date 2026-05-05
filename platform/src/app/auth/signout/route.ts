import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign-out route.
 * Usage: <form action="/auth/signout" method="POST"> from any server or client component.
 */
export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
  );
}
