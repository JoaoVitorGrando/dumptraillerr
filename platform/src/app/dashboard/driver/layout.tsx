import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DEMO_JOBS } from "@/data/demo";

export default async function DriverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userName = String(user?.user_metadata?.full_name ?? "")
    .trim()
    .split(" ")[0];

  // Demo: today's jobs count as a notification badge
  const alertCount = DEMO_JOBS.length;

  return (
    <DashboardShell
      role="driver"
      alertCount={alertCount}
      userEmail={user?.email ?? undefined}
      userName={userName || undefined}
    >
      {children}
    </DashboardShell>
  );
}
