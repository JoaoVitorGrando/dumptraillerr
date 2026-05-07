import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DEMO_FLEET } from "@/data/demo";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Demo: rented trailers as a notification badge
  const alertCount = DEMO_FLEET.filter((t) => t.status === "rented").length;

  return (
    <DashboardShell role="owner" alertCount={alertCount} userEmail={user?.email ?? undefined}>
      {children}
    </DashboardShell>
  );
}
