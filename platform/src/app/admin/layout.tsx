import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/admin");

  const role = user.user_metadata?.role as string | undefined;
  if (role !== "admin") redirect("/dashboard/customer");

  // Count actionable alerts (pending owner/driver approvals + failed payments)
  const [pendingOwners, pendingDrivers, failedPayments] = await Promise.all([
    prisma.ownerProfile.count({ where: { approvedAt: null } }),
    prisma.driverProfile.count({ where: { approvedAt: null } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
  ]);

  const alertCount = pendingOwners + pendingDrivers + failedPayments;

  return (
    <AdminShell alertCount={alertCount} userEmail={user.email ?? undefined}>
      {children}
    </AdminShell>
  );
}
