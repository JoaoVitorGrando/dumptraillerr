"use client";

import { useState, useTransition } from "react";

type LocationType = "DEPOT" | "CUSTOMER_SITE" | "DISPOSAL_SITE" | "IN_TRANSIT" | "UNKNOWN";

interface Props {
  trailerId: string;
  initialName: string;
  initialSize: string;
  initialPricePerPeriod: number;
  initialLocationType: LocationType;
  initialLocationLabel: string | null;
}

export default function OwnerTrailerQuickEdit({
  trailerId,
  initialName,
  initialSize,
  initialPricePerPeriod,
  initialLocationType,
  initialLocationLabel,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [size, setSize] = useState(initialSize);
  const [pricePerPeriod, setPricePerPeriod] = useState(String(initialPricePerPeriod));
  const [locationType, setLocationType] = useState<LocationType>(initialLocationType);
  const [locationLabel, setLocationLabel] = useState(initialLocationLabel ?? "");
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/owner/fleet/${trailerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          size: size.trim(),
          pricePerPeriod: Number(pricePerPeriod),
          currentLocationType: locationType,
          currentLocationLabel: locationLabel.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Could not update trailer.");
        return;
      }
      window.location.reload();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex-1 text-center text-xs font-semibold text-brand-orange border border-brand-orange/30 rounded-lg py-2 hover:bg-brand-orange/5 transition-colors"
      >
        {isOpen ? "Close edit" : "Edit"}
      </button>

      {isOpen && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-brand-light/30 p-3 space-y-2">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-700">
              {error}
            </div>
          )}

          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gray">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gray">Size</span>
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gray">
              Price per period (cents)
            </span>
            <input
              type="number"
              min={1}
              value={pricePerPeriod}
              onChange={(e) => setPricePerPeriod(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gray">
              Location type
            </span>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs"
            >
              <option value="DEPOT">DEPOT</option>
              <option value="CUSTOMER_SITE">CUSTOMER_SITE</option>
              <option value="DISPOSAL_SITE">DISPOSAL_SITE</option>
              <option value="IN_TRANSIT">IN_TRANSIT</option>
              <option value="UNKNOWN">UNKNOWN</option>
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-gray">
              Location label
            </span>
            <input
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs"
              placeholder="Current place/address"
            />
          </label>

          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="btn-primary w-full !text-xs !py-2 disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      )}
    </div>
  );
}
