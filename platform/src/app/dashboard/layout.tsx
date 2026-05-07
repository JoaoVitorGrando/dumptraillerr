import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware should have caught this, but double-check
  if (!user) redirect("/auth/login?redirectTo=/dashboard/customer");

  // The role-specific subfolders (customer/owner/driver) own the visual
  // shell so each can declare its own page-title catalog & nav groups.
  return <>{children}</>;
}
