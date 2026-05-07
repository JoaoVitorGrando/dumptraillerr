import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getDemoBookingsForUser } from "@/lib/demoBookings";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Surface a small notification badge with active rentals
  let alertCount = 0;
  if (user?.email) {
    const bookings = await getDemoBookingsForUser(user.email);
    alertCount = bookings.filter(
      (b) => b.status === "active" || b.status === "confirmed",
    ).length;
  }

  return (
    <DashboardShell role="customer" alertCount={alertCount} userEmail={user?.email ?? undefined}>
      {children}
    </DashboardShell>
  );
}
