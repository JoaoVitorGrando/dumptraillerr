"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SIZES = ["7×12", "7×14", "7×16", "7×18", "8×20", "Custom"];

export default function AddTrailerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [size, setSize] = useState("7×14");
  const [customSize, setCustomSize] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [plate, setPlate] = useState("");
  const [dailyRate, setDailyRate] = useState("175");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: POST para Supabase
    await new Promise((r) => setTimeout(r, 1200));

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard/owner/fleet"), 1500);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🚛</div>
          <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
            Trailer added!
          </h2>
          <p className="text-brand-gray text-sm">Redirecting to your fleet…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Add a Trailer</h1>
        <p className="text-brand-gray mt-1 text-sm">
          List a new dump trailer in your FAGU fleet.
        </p>
      </div>

      <div className="max-w-xl bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Trailer Name"
            hint="A friendly name, e.g. 'Big Blue' or 'Workhorse'"
          >
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workhorse"
              className={inputCls}
            />
          </Field>

          <Field label="Size">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className={inputCls}
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          {size === "Custom" && (
            <Field label="Custom Size (ft)">
              <input
                type="text"
                required
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="e.g. 6×10"
                className={inputCls}
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year">
              <input
                type="number"
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="License Plate">
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="WA-0000-T"
                className={inputCls}
              />
            </Field>
          </div>

          <Field
            label="Daily Rate (USD)"
            hint="Recommended: $150–$300 depending on size"
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray text-sm">$</span>
              <input
                type="number"
                required
                min="50"
                max="1000"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                className={`${inputCls} pl-8`}
              />
            </div>
          </Field>

          <Field
            label="Description (optional)"
            hint="Condition, features, special notes"
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Well-maintained. Hydraulic dump. Electric brakes."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="pt-2 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Adding…" : "Add Trailer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-brand-gray mt-1">{hint}</p>}
    </div>
  );
}
