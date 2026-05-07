"use client";

import { useState, useTransition } from "react";

type TrailerStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

interface TrailerItem {
  id: string;
  name: string;
  slug: string;
  size: string;
  pricePerPeriod: number;
  status: TrailerStatus;
  images: string[];
  owner: { companyName: string | null; user: { email: string } };
  bookings: { serviceDate: string; pickupDate: string | null; status: string }[];
  _count: { bookings: number };
}

const STATUS_COLORS: Record<TrailerStatus, string> = {
  AVAILABLE: "bg-green-50 text-green-700 border-green-200",
  RENTED: "bg-blue-50 text-blue-700 border-blue-200",
  MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
};

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FleetClient({ initialTrailers }: { initialTrailers: TrailerItem[] }) {
  const [trailers, setTrailers] = useState<TrailerItem[]>(initialTrailers);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const available = trailers.filter((t) => t.status === "AVAILABLE").length;
  const rented = trailers.filter((t) => t.status === "RENTED").length;
  const maintenance = trailers.filter((t) => t.status === "MAINTENANCE").length;

  function updateStatus(id: string, status: TrailerStatus) {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/fleet/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to update");
        return;
      }
      setTrailers((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Fleet</h1>
        <p className="text-brand-gray mt-1 text-sm">
          {trailers.length} trailers · {available} available · {rented} rented · {maintenance} in maintenance
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Available", count: available, color: "bg-green-50 border-green-200 text-green-700" },
          { label: "Rented", count: rented, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Maintenance", count: maintenance, color: "bg-amber-50 border-amber-200 text-amber-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {trailers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-brand-gray text-sm">
          No trailers in fleet yet.
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${isPending ? "opacity-70" : ""}`}>
          {trailers.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {t.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.images[0]} alt={t.name} className="w-full h-36 object-cover bg-gray-100" />
              ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-brand-dark">{t.name}</h3>
                    <p className="text-xs text-brand-gray">
                      {t.size} · {t.owner.companyName ?? t.owner.user.email}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[t.status]}`}>
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                  <Stat label="/period" value={formatCents(t.pricePerPeriod)} />
                  <Stat label="completed" value={`${t._count.bookings} trips`} />
                </div>

                {t.bookings[0] && (
                  <p className="text-xs text-brand-gray mb-3">
                    Next booking: <strong className="text-brand-dark">{formatDate(t.bookings[0].serviceDate)}</strong>
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {(["AVAILABLE", "RENTED", "MAINTENANCE"] as TrailerStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={t.status === s || isPending}
                      onClick={() => updateStatus(t.id, s)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize transition-all disabled:opacity-50 ${
                        t.status === s
                          ? "bg-brand-dark text-white border-brand-dark cursor-default"
                          : "text-brand-gray border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {s.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-light rounded-lg py-2">
      <p className="text-sm font-bold text-brand-dark">{value}</p>
      <p className="text-xs text-brand-gray">{label}</p>
    </div>
  );
}
