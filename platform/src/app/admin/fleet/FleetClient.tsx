"use client";

import { useMemo, useState, useTransition } from "react";

type TrailerStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";
type TrailerLocationType = "DEPOT" | "CUSTOMER_SITE" | "DISPOSAL_SITE" | "IN_TRANSIT" | "UNKNOWN";

interface TrailerItem {
  id: string;
  name: string;
  slug: string;
  size: string;
  capacity: string;
  gvwr: string;
  payload: string;
  ownerId: string;
  pricePerPeriod: number;
  status: TrailerStatus;
  currentLocationType: TrailerLocationType;
  currentLocationLabel: string | null;
  images: string[];
  owner: { companyName: string | null; user: { email: string } };
  bookings: { serviceDate: string; pickupDate: string | null; status: string }[];
  _count: { bookings: number };
}

interface OwnerOption {
  id: string;
  label: string;
}

const STATUS_COLORS: Record<TrailerStatus, string> = {
  AVAILABLE: "bg-green-50 text-green-700 border-green-200",
  RENTED: "bg-blue-50 text-blue-700 border-blue-200",
  MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
};

const LOCATION_LABELS: Record<TrailerLocationType, string> = {
  DEPOT: "Depot",
  CUSTOMER_SITE: "Customer",
  DISPOSAL_SITE: "Disposal",
  IN_TRANSIT: "In transit",
  UNKNOWN: "Unknown",
};

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-orange/50";

interface TrailerFormState {
  ownerId: string;
  name: string;
  size: string;
  capacity: string;
  gvwr: string;
  payload: string;
  pricePerPeriod: string;
  status: TrailerStatus;
  image: string;
  currentLocationType: TrailerLocationType;
  currentLocationLabel: string;
}

const EMPTY_FORM: TrailerFormState = {
  ownerId: "",
  name: "",
  size: "",
  capacity: "",
  gvwr: "",
  payload: "",
  pricePerPeriod: "",
  status: "AVAILABLE",
  image: "",
  currentLocationType: "DEPOT",
  currentLocationLabel: "",
};

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FleetClient({
  initialTrailers,
  ownerOptions,
}: {
  initialTrailers: TrailerItem[];
  ownerOptions: OwnerOption[];
}) {
  const [trailers, setTrailers] = useState<TrailerItem[]>(initialTrailers);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editTrailerId, setEditTrailerId] = useState<string | null>(null);
  const [form, setForm] = useState<TrailerFormState>({
    ...EMPTY_FORM,
    ownerId: ownerOptions[0]?.id ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const available = trailers.filter((t) => t.status === "AVAILABLE").length;
  const rented = trailers.filter((t) => t.status === "RENTED").length;
  const maintenance = trailers.filter((t) => t.status === "MAINTENANCE").length;
  const inTransit = trailers.filter((t) => t.currentLocationType === "IN_TRANSIT").length;

  const isEditMode = Boolean(editTrailerId);
  const submitLabel = isEditMode ? "Save changes" : "Add trailer";

  const editTrailer = useMemo(
    () => trailers.find((t) => t.id === editTrailerId) ?? null,
    [trailers, editTrailerId]
  );

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

  function startCreate() {
    setEditTrailerId(null);
    setForm({
      ...EMPTY_FORM,
      ownerId: ownerOptions[0]?.id ?? "",
    });
    setError(null);
  }

  function startEdit(trailer: TrailerItem) {
    setEditTrailerId(trailer.id);
    setForm({
      ownerId: trailer.ownerId,
      name: trailer.name,
      size: trailer.size,
      capacity: trailer.capacity,
      gvwr: trailer.gvwr,
      payload: trailer.payload,
      pricePerPeriod: String(trailer.pricePerPeriod),
      status: trailer.status,
      image: trailer.images[0] ?? "",
      currentLocationType: trailer.currentLocationType,
      currentLocationLabel: trailer.currentLocationLabel ?? "",
    });
    setError(null);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const payload = {
        ownerId: form.ownerId,
        name: form.name.trim(),
        size: form.size.trim(),
        capacity: form.capacity.trim(),
        gvwr: form.gvwr.trim(),
        payload: form.payload.trim(),
        pricePerPeriod: Number(form.pricePerPeriod),
        status: form.status,
        images: form.image.trim() ? [form.image.trim()] : [],
        currentLocationType: form.currentLocationType,
        currentLocationLabel: form.currentLocationLabel.trim() || null,
      };

      const res = await fetch(
        isEditMode ? `/api/admin/fleet/${editTrailerId}` : "/api/admin/fleet",
        {
          method: isEditMode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Could not save trailer.");
        return;
      }

      window.location.reload();
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTrailer(id: string) {
    const confirmed = window.confirm("Delete this trailer? This action cannot be undone.");
    if (!confirmed) return;

    setError(null);
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/fleet/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Could not delete trailer.");
        return;
      }
      setTrailers((prev) => prev.filter((t) => t.id !== id));
      if (editTrailerId === id) {
        startCreate();
      }
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Fleet</h1>
        <p className="text-brand-gray mt-1 text-sm">
          {trailers.length} trailers · {available} available · {rented} rented · {maintenance} in maintenance · {inTransit} in transit
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Available", count: available, color: "bg-green-50 border-green-200 text-green-700" },
          { label: "Rented", count: rented, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Maintenance", count: maintenance, color: "bg-amber-50 border-amber-200 text-amber-700" },
          { label: "In transit", count: inTransit, color: "bg-purple-50 border-purple-200 text-purple-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-brand-dark">
            {isEditMode ? `Edit trailer: ${editTrailer?.name ?? ""}` : "Add trailer"}
          </h2>
          <button
            type="button"
            onClick={startCreate}
            className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
          >
            New trailer
          </button>
        </div>

        <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <Field label="Owner">
            <select
              value={form.ownerId}
              onChange={(e) => setForm((p) => ({ ...p, ownerId: e.target.value }))}
              className={INPUT_CLASS}
              required
            >
              {ownerOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Name">
            <input
              className={INPUT_CLASS}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </Field>

          <Field label="Size">
            <input
              className={INPUT_CLASS}
              value={form.size}
              onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
              required
            />
          </Field>

          <Field label="Price per period (cents)">
            <input
              type="number"
              min={0}
              className={INPUT_CLASS}
              value={form.pricePerPeriod}
              onChange={(e) => setForm((p) => ({ ...p, pricePerPeriod: e.target.value }))}
              required
            />
          </Field>

          <Field label="Capacity">
            <input className={INPUT_CLASS} value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} />
          </Field>
          <Field label="GVWR">
            <input className={INPUT_CLASS} value={form.gvwr} onChange={(e) => setForm((p) => ({ ...p, gvwr: e.target.value }))} />
          </Field>
          <Field label="Payload">
            <input className={INPUT_CLASS} value={form.payload} onChange={(e) => setForm((p) => ({ ...p, payload: e.target.value }))} />
          </Field>
          <Field label="Image URL">
            <input className={INPUT_CLASS} value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as TrailerStatus }))}
              className={INPUT_CLASS}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="RENTED">RENTED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </Field>

          <Field label="Location type">
            <select
              value={form.currentLocationType}
              onChange={(e) =>
                setForm((p) => ({ ...p, currentLocationType: e.target.value as TrailerLocationType }))
              }
              className={INPUT_CLASS}
            >
              <option value="DEPOT">DEPOT</option>
              <option value="CUSTOMER_SITE">CUSTOMER_SITE</option>
              <option value="DISPOSAL_SITE">DISPOSAL_SITE</option>
              <option value="IN_TRANSIT">IN_TRANSIT</option>
              <option value="UNKNOWN">UNKNOWN</option>
            </select>
          </Field>

          <Field label="Location label">
            <input
              className={INPUT_CLASS}
              value={form.currentLocationLabel}
              onChange={(e) => setForm((p) => ({ ...p, currentLocationLabel: e.target.value }))}
              placeholder="Address or point name"
            />
          </Field>

          <div className="md:col-span-2 xl:col-span-4 flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : submitLabel}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={() => editTrailerId && deleteTrailer(editTrailerId)}
                disabled={isDeleting === editTrailerId}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {isDeleting === editTrailerId ? "Deleting..." : "Delete trailer"}
              </button>
            )}
          </div>
        </form>
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
                    <p className="text-[10px] font-semibold text-brand-gray">ID: {t.id}</p>
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

                <p className="text-xs text-brand-gray mb-1">
                  Location:{" "}
                  <strong className="text-brand-dark">
                    {LOCATION_LABELS[t.currentLocationType]}
                    {t.currentLocationLabel ? ` · ${t.currentLocationLabel}` : ""}
                  </strong>
                </p>

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
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border text-brand-gray border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTrailer(t.id)}
                    disabled={isDeleting === t.id}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border text-red-700 border-red-200 hover:bg-red-50 disabled:opacity-60"
                  >
                    {isDeleting === t.id ? "deleting..." : "delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-brand-gray">{label}</span>
      {children}
    </label>
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
