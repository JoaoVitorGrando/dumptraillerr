"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const DriverOffersMap = dynamic(() => import("./DriverOffersMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[560px] w-full rounded-xl border border-gray-200 bg-brand-light/30 animate-pulse" />
  ),
});

export interface DriverOfferItem {
  id: string;
  serviceDate: string;
  pickupDate: string | null;
  deliveryAddress: string;
  trailerName: string;
  customerEmail: string;
  lat: number;
  lng: number;
}

export default function DriverOffersList({ initialOffers }: { initialOffers: DriverOfferItem[] }) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [offers, setOffers] = useState<DriverOfferItem[]>(initialOffers);
  const offersForDisplay = useMemo(() => {
    if (offers.length >= 5) return offers;

    const fallback: DriverOfferItem[] = [
      {
        id: "fallback-offer-1",
        serviceDate: new Date().toISOString(),
        pickupDate: new Date().toISOString(),
        deliveryAddress: "2101 4th Ave, Seattle, WA",
        trailerName: "Dump Trailer - Downtown",
        customerEmail: "dispatch1@fagu.com",
        lat: 47.6132,
        lng: -122.3425,
      },
      {
        id: "fallback-offer-2",
        serviceDate: new Date(Date.now() + 86400000).toISOString(),
        pickupDate: new Date(Date.now() + 86400000).toISOString(),
        deliveryAddress: "500 Mercer St, Seattle, WA",
        trailerName: "Dump Trailer - Uptown",
        customerEmail: "dispatch2@fagu.com",
        lat: 47.6249,
        lng: -122.3521,
      },
      {
        id: "fallback-offer-3",
        serviceDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        pickupDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        deliveryAddress: "600 5th Ave S, Seattle, WA",
        trailerName: "Dump Trailer - Stadium",
        customerEmail: "dispatch3@fagu.com",
        lat: 47.5966,
        lng: -122.3277,
      },
      {
        id: "fallback-offer-4",
        serviceDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        pickupDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        deliveryAddress: "1401 Alaskan Way, Seattle, WA",
        trailerName: "Dump Trailer - Waterfront",
        customerEmail: "dispatch4@fagu.com",
        lat: 47.6073,
        lng: -122.3431,
      },
    ];

    const missingCount = 5 - offers.length;
    return [...offers, ...fallback.slice(0, missingCount)];
  }, [offers]);

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(offersForDisplay[0]?.id ?? null);
  const [detailsOfferId, setDetailsOfferId] = useState<string | null>(null);
  const [missionOffer, setMissionOffer] = useState<DriverOfferItem | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isClaimPending, startTransition] = useTransition();
  const [missionError, setMissionError] = useState<string | null>(null);
  const [missionLoading, setMissionLoading] = useState(false);
  const detailsOffer =
    offersForDisplay.find((offer) => offer.id === detailsOfferId) ?? null;

  function acceptOffer(offer: DriverOfferItem) {
    setClaimError(null);
    startTransition(async () => {
      const res = await fetch(`/api/driver/offers/${offer.id}/claim`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setClaimError(data.error ?? "Could not accept this delivery.");
        return;
      }

      setMissionOffer(offer);
      setDetailsOfferId(null);
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
      setSelectedOfferId((prev) => {
        if (prev !== offer.id) return prev;
        return null;
      });
    });
  }

  async function cancelMission() {
    if (!missionOffer) return;
    setMissionError(null);
    setMissionLoading(true);
    try {
      const res = await fetch(`/api/driver/offers/${missionOffer.id}/claim`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setMissionError(data.error ?? "Could not cancel this delivery.");
        return;
      }
      setOffers((prev) => [missionOffer, ...prev]);
      setSelectedOfferId(missionOffer.id);
      setMissionOffer(null);
    } finally {
      setMissionLoading(false);
    }
  }

  async function startMissionRoute() {
    if (!missionOffer) return;
    setMissionError(null);
    setMissionLoading(true);
    try {
      const startRes = await fetch(`/api/driver/offers/${missionOffer.id}/start`, {
        method: "PATCH",
      });
      if (!startRes.ok) {
        const data = (await startRes.json()) as { error?: string };
        setMissionError(data.error ?? "Could not start route.");
        return;
      }
      router.push(`/dashboard/driver/job/${missionOffer.id}?autoNav=pickup`);
      router.refresh();
    } finally {
      setMissionLoading(false);
    }
  }

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const stepPx = 1;
    const intervalMs = 28;

    const intervalId = window.setInterval(() => {
      if (container.scrollHeight <= container.clientHeight) return;

      container.scrollTop += stepPx;

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
        container.scrollTop = 0;
      }
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [offersForDisplay.length]);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-3 items-stretch">
        <div
          ref={carouselRef}
          className="rounded-xl border border-gray-200 bg-white p-3 max-h-[560px] overflow-y-auto"
        >
          <div className="space-y-3 pr-1">
            {offersForDisplay.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-sm font-semibold text-brand-dark">No deliveries available right now.</p>
                <p className="text-xs text-brand-gray mt-1">
                  New offers will appear here automatically.
                </p>
              </div>
            )}

            {offersForDisplay.map((offer) => (
              <div
                key={offer.id}
                className={[
                  "rounded-[24px] border bg-white p-4 shadow-lg transition-all",
                  selectedOfferId === offer.id ? "border-brand-orange/50" : "border-gray-200",
                ].join(" ")}
              >
                <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-200" />

                <div className="mb-4">
                  <h3 className="font-display text-xl font-bold text-brand-dark">New Delivery Available</h3>
                  <p className="text-xs text-brand-gray mt-1">Accept now and start a great run.</p>
                </div>

                <div className="rounded-2xl border border-brand-orange/30 bg-white p-3">
                  <div className="grid grid-cols-[32px_1fr] gap-3">
                    <div className="relative flex flex-col items-center">
                      <span className="mt-1 h-3.5 w-3.5 rounded-full bg-brand-orange ring-4 ring-brand-orange/15" />
                      <span className="my-2 h-8 border-l-2 border-dashed border-brand-orange/60" />
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-brand-orange bg-white" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="inline-flex rounded-md bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                          Pickup
                        </span>
                        <p className="mt-1 text-sm font-semibold text-brand-dark">
                          Trailer owner pickup point
                        </p>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <span className="inline-flex rounded-md bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                          Delivery
                        </span>
                        <p className="mt-1 text-sm font-semibold text-brand-dark break-words">
                          {offer.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-gray-200 bg-brand-light/25 p-3">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-brand-gray">Receiver contact</span>
                    <span className="font-semibold text-brand-dark break-all text-right">
                      {offer.customerEmail}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-brand-gray text-xs">Delivery payout</span>
                    <span className="font-display text-2xl font-bold text-brand-orange">$40.00</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOfferId(offer.id);
                      setClaimError(null);
                      setDetailsOfferId(offer.id);
                    }}
                    className="mt-2 w-full rounded-lg border border-brand-orange/40 bg-white px-3 py-2 text-xs font-bold text-brand-orange hover:bg-brand-orange/5 transition-colors"
                  >
                    View details
                  </button>
                </div>

                <div className="mt-4">
                  {selectedOfferId === offer.id && claimError && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {claimError}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOfferId(offer.id);
                        setClaimError(null);
                        setDetailsOfferId(offer.id);
                      }}
                      className="w-full rounded-lg border border-brand-orange bg-brand-orange/10 px-3 py-2 text-xs font-bold text-brand-orange hover:bg-brand-orange/20 transition-colors"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOfferId(offer.id);
                        acceptOffer(offer);
                      }}
                      disabled={isClaimPending}
                      className="w-full rounded-lg bg-brand-orange px-3 py-2 text-xs font-bold text-white hover:bg-brand-orange/90 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isClaimPending && selectedOfferId === offer.id
                        ? "Accepting..."
                        : "Accept delivery"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DriverOffersMap
          offers={offersForDisplay}
          selectedOfferId={selectedOfferId}
          onSelectOffer={(offerId) => {
            setSelectedOfferId(offerId);
            setClaimError(null);
          }}
        />
      </div>

      {detailsOffer && (
        <div className="fixed inset-0 z-[1800] bg-black/40 backdrop-blur-[1px] p-4 sm:p-6">
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-display text-xl font-bold text-brand-dark">Delivery details</h3>
              <button
                type="button"
                onClick={() => setDetailsOfferId(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-gray hover:bg-gray-100"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-brand-gray">Pickup</span>
                <span className="font-semibold text-brand-dark text-right">Trailer owner pickup point</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-brand-gray">Delivery</span>
                <span className="font-semibold text-brand-dark text-right">{detailsOffer.deliveryAddress}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-brand-gray">Receiver</span>
                <span className="font-semibold text-brand-dark text-right">{detailsOffer.customerEmail}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-brand-gray">Payout</span>
                <span className="font-display text-2xl font-bold text-brand-orange">$40.00</span>
              </div>
            </div>
            <div className="border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedOfferId(detailsOffer.id);
                  acceptOffer(detailsOffer);
                }}
                disabled={isClaimPending}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isClaimPending && selectedOfferId === detailsOffer.id
                  ? "Accepting..."
                  : "Accept delivery"}
              </button>
            </div>
          </div>
        </div>
      )}

      {missionOffer && (
        <div className="fixed inset-0 z-[1900] bg-black/45 backdrop-blur-[1px] p-4 sm:p-6">
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="font-display text-xl font-bold text-brand-dark">Mission accepted</h3>
                <p className="text-xs text-brand-gray mt-0.5">
                  Confirm pickup route and then proceed to customer destination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMissionOffer(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-gray hover:bg-gray-100"
                aria-label="Close mission modal"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="rounded-xl border border-brand-orange/30 bg-white p-4">
                <div className="grid grid-cols-[28px_1fr] gap-3">
                  <div className="relative flex flex-col items-center">
                    <span className="mt-1 h-3 w-3 rounded-full bg-brand-orange ring-4 ring-brand-orange/15" />
                    <span className="my-2 h-8 border-l-2 border-dashed border-brand-orange/60" />
                    <span className="h-3 w-3 rounded-full border-2 border-brand-orange bg-white" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="inline-flex rounded-md bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        Pickup trailer
                      </span>
                      <p className="mt-1 text-sm font-semibold text-brand-dark">
                        Trailer owner pickup point
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <span className="inline-flex rounded-md bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        Deliver to customer
                      </span>
                      <p className="mt-1 text-sm font-semibold text-brand-dark break-words">
                        {missionOffer.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-brand-light/25 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-brand-gray">Receiver contact</span>
                  <span className="font-semibold text-brand-dark break-all text-right">
                    {missionOffer.customerEmail}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-brand-gray text-sm">Driver payout</span>
                  <span className="font-display text-3xl font-bold text-brand-orange">$40.00</span>
                </div>
              </div>

              {missionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {missionError}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={cancelMission}
                disabled={missionLoading}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-brand-dark hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel and return to available
              </button>
              <button
                type="button"
                onClick={startMissionRoute}
                disabled={missionLoading}
                className="w-full rounded-lg bg-brand-orange px-3 py-2 text-sm font-bold text-white hover:bg-brand-orange/90 disabled:opacity-60"
              >
                {missionLoading ? "Starting route..." : "Start route"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
