"use client";

import { useState, useTransition } from "react";

interface AvailabilityBlock {
  id: string;
  trailerId: string;
  blockedFrom: string;
  blockedUntil: string;
  reason: string | null;
  trailer: { name: string };
}

interface TrailerOption {
  id: string;
  name: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AvailabilityClient({
  initialBlocks,
  trailers,
}: {
  initialBlocks: AvailabilityBlock[];
  trailers: TrailerOption[];
}) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(initialBlocks);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    trailerId: trailers[0]?.id ?? "",
    blockedFrom: "",
    blockedUntil: "",
    reason: "",
  });

  function createBlock() {
    setError(null);
    if (!form.trailerId || !form.blockedFrom || !form.blockedUntil) {
      setError("Please fill trailer, start date, and end date.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to create block");
        return;
      }
      const block = await res.json() as AvailabilityBlock & { trailer?: { name: string } };
      const trailer = trailers.find((t) => t.id === form.trailerId);
      setBlocks((prev) => [{ ...block, trailer: { name: trailer?.name ?? "" } }, ...prev]);
      setForm({ trailerId: trailers[0]?.id ?? "", blockedFrom: "", blockedUntil: "", reason: "" });
      setShowForm(false);
    });
  }

  function deleteBlock(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/availability/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to delete");
        return;
      }
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    });
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Availability</h1>
          <p className="text-brand-gray mt-1 text-sm">
            {blocks.length} manual block{blocks.length !== 1 ? "s" : ""} active
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="btn-primary shrink-0"
        >
          + Block Period
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-brand-dark mb-4">New Availability Block</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">Trailer</span>
              <select
                value={form.trailerId}
                onChange={(e) => setForm((f) => ({ ...f, trailerId: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {trailers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">Reason (optional)</span>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="e.g. Maintenance"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">Block From</span>
              <input
                type="date"
                value={form.blockedFrom}
                onChange={(e) => setForm((f) => ({ ...f, blockedFrom: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">Block Until</span>
              <input
                type="date"
                value={form.blockedUntil}
                onChange={(e) => setForm((f) => ({ ...f, blockedUntil: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={createBlock}
              disabled={isPending}
              className="btn-primary disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Create Block"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`space-y-3 ${isPending ? "opacity-70" : ""}`}>
        {blocks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-brand-gray text-sm">
            No manual blocks. Trailers are available unless a booking exists.
          </div>
        ) : (
          blocks.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-brand-dark">{b.trailer.name}</p>
                <p className="text-xs text-brand-gray mt-0.5">
                  {formatDate(b.blockedFrom)} → {formatDate(b.blockedUntil)}
                  {b.reason && <span className="ml-2 text-brand-gray">· {b.reason}</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteBlock(b.id)}
                disabled={isPending}
                className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
