"use client";

import { useState } from "react";
import { DEMO_FLEET, formatCents, statusColor, statusLabel, type DemoTrailer, type TrailerStatus } from "@/data/demo";

export default function AdminFleetPage() {
  const [fleet, setFleet] = useState<DemoTrailer[]>(DEMO_FLEET);

  function updateStatus(id: string, status: TrailerStatus) {
    // TODO: PATCH Supabase
    setFleet((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  }

  const available = fleet.filter((t) => t.status === "available").length;
  const rented = fleet.filter((t) => t.status === "rented").length;
  const maintenance = fleet.filter((t) => t.status === "maintenance").length;

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-dark">Fleet</h1>
            <p className="text-brand-gray mt-1 text-sm">
              {fleet.length} trailers · {available} available · {rented} rented · {maintenance} in maintenance
            </p>
          </div>
        </div>
      </div>

      {/* Status summary strip */}
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

      {/* Fleet grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fleet.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.image} alt={t.name} className="w-full h-36 object-cover bg-gray-100" />
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
                <Stat label="/day" value={formatCents(t.dailyRate)} />
                <Stat label="trips" value={String(t.totalTrips)} />
                <Stat label="earned" value={formatCents(t.totalEarnings)} />
              </div>

              {t.nextAvailable && t.status !== "available" && (
                <p className="text-xs text-brand-gray mb-3">
                  Next available: <strong className="text-brand-dark">{t.nextAvailable}</strong>
                </p>
              )}

              {/* Status controls */}
              <div className="flex flex-wrap gap-1.5">
                {(["available", "rented", "maintenance"] as TrailerStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={t.status === s}
                    onClick={() => updateStatus(t.id, s)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize transition-all ${
                      t.status === s
                        ? "bg-brand-dark text-white border-brand-dark cursor-default"
                        : "text-brand-gray border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
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
