import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "New Booking — FAGU Home Services" };

export default async function CustomerBookPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/services/dump-trailer#booking");
  redirect("/services/dump-trailer#booking");
}
