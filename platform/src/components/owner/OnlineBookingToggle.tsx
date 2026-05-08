"use client";

import { useState, useTransition } from "react";

/**
 * Toggle "Reservável online" por trailer.
 *
 * Quando OFF:
 * - O trailer some das listagens públicas.
 * - /api/checkout rejeita reservas para esse trailer.
 * - Bookings já confirmadas seguem ativas (não são canceladas).
 *
 * Use case: owner está alugando fora da plataforma temporariamente.
 */
export interface OnlineBookingToggleProps {
  trailerId: string;
  initialEnabled: boolean;
  /** Quando true, o toggle é apenas decorativo (modo demo sem DB). */
  readOnly?: boolean;
}

export default function OnlineBookingToggle({
  trailerId,
  initialEnabled,
  readOnly = false,
}: OnlineBookingToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    if (readOnly || isPending) return;
    const next = !enabled;
    setEnabled(next); // optimistic
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/owner/fleet/${trailerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ onlineBookingEnabled: next }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }
      } catch (e) {
        // rollback
        setEnabled(!next);
        setError(e instanceof Error ? e.message : "Failed to update");
      }
    });
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-brand-light/30 px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">
            Online booking
          </p>
          <p className="text-[11px] text-brand-gray leading-tight">
            {enabled
              ? "Customers can reserve this trailer."
              : "Hidden from listings — rent offline only."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle online booking"
          disabled={readOnly || isPending}
          onClick={handleToggle}
          className={[
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-brand-orange/40",
            enabled ? "bg-brand-orange" : "bg-gray-300",
            readOnly || isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
              enabled ? "translate-x-5" : "translate-x-0.5",
            ].join(" ")}
          />
        </button>
      </div>
      {error && (
        <p className="text-[11px] font-semibold text-red-600 px-1">{error}</p>
      )}
      {readOnly && (
        <p className="text-[10px] text-brand-gray italic px-1">
          Demo mode — toggle is read-only.
        </p>
      )}
    </div>
  );
}
