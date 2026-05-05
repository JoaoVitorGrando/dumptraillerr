import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_FLEET, formatCents, statusColor, statusLabel } from "@/data/demo";

export const metadata = { title: "My Fleet — FAGU Home Services" };

export default async function OwnerFleetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/owner/fleet");

  const fleet = DEMO_FLEET; // TODO: query real

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">My Fleet</h1>
          <p className="text-brand-gray mt-1 text-sm">{fleet.length} trailers registered</p>
        </div>
        <Link href="/dashboard/owner/fleet/new" className="btn-primary shrink-0">
          + Add Trailer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fleet.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.image}
              alt={t.name}
              className="w-full h-40 object-cover bg-gray-100"
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-brand-dark">{t.name}</h3>
                  <p className="text-xs text-brand-gray">{t.size} · {t.year} · {t.licensePlate}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusColor(t.status)}`}>
                  {statusLabel(t.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="bg-brand-light rounded-lg py-2">
                  <p className="text-sm font-bold text-brand-dark">{formatCents(t.dailyRate)}</p>
                  <p className="text-xs text-brand-gray">/day</p>
                </div>
                <div className="bg-brand-light rounded-lg py-2">
                  <p className="text-sm font-bold text-brand-dark">{t.totalTrips}</p>
                  <p className="text-xs text-brand-gray">trips</p>
                </div>
                <div className="bg-brand-light rounded-lg py-2">
                  <p className="text-sm font-bold text-brand-dark">{formatCents(t.totalEarnings)}</p>
                  <p className="text-xs text-brand-gray">earned</p>
                </div>
              </div>

              {t.nextAvailable && t.status !== "available" && (
                <p className="text-xs text-brand-gray mb-3">
                  Available from: <strong className="text-brand-dark">{t.nextAvailable}</strong>
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 text-xs font-semibold text-brand-orange border border-brand-orange/30 rounded-lg py-2 hover:bg-brand-orange/5 transition-colors"
                  onClick={() => alert("Edit trailer — coming soon")}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="flex-1 text-xs font-semibold text-brand-gray border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => alert("View schedule — coming soon")}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add trailer card */}
        <Link
          href="/dashboard/owner/fleet/new"
          className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 p-8 h-full min-h-[280px] hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-brand-orange/10 group-hover:bg-brand-orange/20 flex items-center justify-center text-2xl transition-colors">
            +
          </div>
          <p className="text-sm font-semibold text-brand-gray group-hover:text-brand-dark transition-colors">
            Add a Trailer
          </p>
        </Link>
      </div>
    </div>
  );
}
