import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_JOB_HISTORY, formatCents } from "@/data/demo";

export const metadata = { title: "Delivery History — FAGU Driver" };

export default async function DriverHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/driver/history");

  const history = DEMO_JOB_HISTORY;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Delivery History</h1>
        <p className="text-brand-gray mt-1 text-sm">
          {history.length} completed deliveries
        </p>
      </div>

      <div className="space-y-3">
        {history.map((job) => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-bold text-brand-dark">{job.customerName}</p>
                <p className="text-xs text-brand-gray">
                  {job.trailerSize} · {job.scheduledTime} · {job.distanceMiles} mi
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-brand-dark">
                  {formatCents(job.earnings + job.tip)}
                </p>
                {job.tip > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    +{formatCents(job.tip)} tip
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-gray">
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {job.address}, {job.city}
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-brand-gray">
              <span className={job.signatureObtained ? "text-green-600" : "text-amber-600"}>
                {job.signatureObtained ? "✅ Signed" : "⚠️ No signature"}
              </span>
              <span>📷 {job.photos.length} photos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
