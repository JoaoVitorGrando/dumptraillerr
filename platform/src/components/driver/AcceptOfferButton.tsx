"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AcceptOfferButton({ offerId }: { offerId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function acceptOffer() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/driver/offers/${offerId}/claim`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Could not accept this delivery.");
        return;
      }

      router.push(`/dashboard/driver/job/${offerId}?autoNav=pickup`);
      router.refresh();
    });
  }

  return (
    <div>
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={acceptOffer}
        disabled={isPending}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Accepting delivery..." : "Accept delivery"}
      </button>
    </div>
  );
}
