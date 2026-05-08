"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { DemoJob } from "@/data/demo";

interface Props {
  job: DemoJob;
  autoNavigatePickup?: boolean;
}

type Step = 0 | 1 | 2 | 3; // 0=Pickup, 1=Transit, 2=Drop-off+Photo, 3=Close order

const STEP_LABELS = ["Pickup", "Transit", "Drop-off", "Close Order"];
const STEP_ICONS = ["🏠", "🚛", "📷", "✅"];

export default function DeliveryFlow({ job, autoNavigatePickup = false }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [signed, setSigned] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [orderActionPending, setOrderActionPending] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupNavDone, setPickupNavDone] = useState(false);

  // Get GPS on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGpsCoords({ lat: 47.6062, lng: -122.3321 }) // Seattle fallback
      );
    }
  }, []);

  function openMapsRoute(location: string) {
    const q = encodeURIComponent(location);
    window.location.href = `https://maps.google.com/?q=${q}`;
  }

  useEffect(() => {
    if (!autoNavigatePickup || pickupNavDone) return;
    const pickupLocation = job.logistics?.fromLocation;
    if (!pickupLocation) return;
    setPickupNavDone(true);
    openMapsRoute(pickupLocation);
  }, [autoNavigatePickup, job.logistics?.fromLocation, pickupNavDone]);

  async function updateLogisticsOrder(action: "start" | "complete") {
    if (!job.logistics?.orderId) return;

    setOrderError(null);
    setOrderActionPending(true);
    try {
      const res = await fetch(`/api/driver/logistics-orders/${job.logistics.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Could not update logistics order.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update logistics order.";
      setOrderError(message);
      throw err;
    } finally {
      setOrderActionPending(false);
    }
  }

  async function completeJob() {
    setCompleting(true);
    try {
      if (job.logistics?.orderId) {
        await updateLogisticsOrder("complete");
      } else {
        // TODO: POST para Supabase — update job status, save photos + signature + GPS
        await new Promise((r) => setTimeout(r, 700));
      }
      router.push("/dashboard/driver");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-light flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-brand-dark text-white px-5 pt-5 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-white/60 text-sm mb-3 flex items-center gap-1 hover:text-white transition-colors"
        >
          ← Back to jobs
        </button>
        <h1 className="font-display text-2xl font-bold">{job.customerName}</h1>
        <p className="text-white/60 text-xs mt-0.5">
          {job.trailerSize} · {job.scheduledTime} · {job.distanceMiles} mi
        </p>

        {/* Step progress */}
        <div className="flex items-center gap-1 mt-4">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1 font-bold transition-all ${
                i < step ? "bg-green-400 text-white" :
                i === step ? "bg-brand-orange text-white ring-4 ring-brand-orange/30" :
                "bg-white/20 text-white/50"
              }`}>
                {i < step ? "✓" : STEP_ICONS[i]}
              </div>
              <span className={`text-xs font-medium ${i === step ? "text-white" : "text-white/50"}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className="absolute" /> // connector handled by flex gap
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 p-5 flex flex-col gap-5">

        {/* STEP 0 — Pickup confirmation */}
        {step === 0 && (
          <>
            {job.logistics && (
              <InfoCard title="Logistics Mission" icon="🧭">
                <p className="text-xs text-brand-gray">Current order: {job.logistics.orderType}</p>
                <p className="mt-1 text-sm font-semibold text-brand-dark">
                  From: {job.logistics.fromLocation}
                </p>
                <p className="text-sm font-semibold text-brand-dark">
                  To: {job.logistics.toLocation}
                </p>
                {job.logistics.wasteDropLocation && (
                  <p className="text-xs text-brand-gray mt-2">
                    Waste drop: {job.logistics.wasteDropLocation}
                  </p>
                )}
                {job.logistics.nextOrderToLocation && (
                  <p className="text-xs text-brand-gray">
                    Next stop: {job.logistics.nextOrderToLocation}
                  </p>
                )}
                {job.logistics.fromLocation && (
                  <button
                    type="button"
                    onClick={() => openMapsRoute(job.logistics!.fromLocation!)}
                    className="mt-3 inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold hover:underline"
                  >
                    Open trailer location in Maps ↗
                  </button>
                )}
              </InfoCard>
            )}

            <InfoCard title="Delivery Address" icon="📍">
              <p className="font-semibold text-brand-dark">{job.address}</p>
              <p className="text-brand-gray">{job.city}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(job.address + " " + job.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-brand-orange text-sm font-semibold hover:underline"
              >
                Open in Maps ↗
              </a>
            </InfoCard>

            <InfoCard title="Trailer" icon="🚛">
              <p className="font-semibold text-brand-dark">{job.trailerSize} Dump Trailer</p>
            </InfoCard>

            {job.notes && (
              <InfoCard title="Customer Notes" icon="📌">
                <p className="text-brand-dark">{job.notes}</p>
              </InfoCard>
            )}

            {gpsCoords && (
              <InfoCard title="Your Location" icon="🛰️">
                <p className="text-brand-gray text-xs">
                  {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)} · GPS confirmed
                </p>
              </InfoCard>
            )}

            {orderError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {orderError}
              </div>
            )}

            <button
              type="button"
              onClick={async () => {
                if (job.logistics?.orderId) {
                  await updateLogisticsOrder("start");
                }
                setStep(1);
                const nextRoute = job.logistics?.toLocation || `${job.address} ${job.city}`;
                openMapsRoute(nextRoute);
              }}
              disabled={orderActionPending}
              className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {orderActionPending ? "Starting logistics..." : "I arrived at trailer"}
            </button>
          </>
        )}

        {/* STEP 1 — En route */}
        {step === 1 && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-5xl mb-4">🚛</div>
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                En Route
              </h2>
              <p className="text-brand-gray text-sm mb-1">{job.address}</p>
              <p className="text-brand-gray text-sm">{job.city}</p>
              <div className="mt-4 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-brand-orange animate-pulse w-1/2" />
              </div>
              <p className="text-xs text-brand-gray mt-2">{job.distanceMiles} miles · approx. {Math.round(job.distanceMiles * 2.5)} min</p>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(job.address + " " + job.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full text-center"
            >
              Open Navigation ↗
            </a>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary w-full text-base py-4"
            >
              I arrived at customer
            </button>
          </>
        )}

        {/* STEP 2 — Deliver + Photos */}
        {step === 2 && (
          <>
            <InfoCard title="Take Photos" icon="📷">
              <p className="text-sm text-brand-gray mb-3">
                Take at least 2 photos: trailer placement and delivery confirmation.
              </p>
              <PhotoCapture photos={photos} onAdd={(p) => setPhotos((prev) => [...prev, p])} onRemove={(i) => setPhotos((prev) => prev.filter((_, idx) => idx !== i))} />
            </InfoCard>

            <button
              type="button"
              disabled={photos.length < 1}
              onClick={() => setStep(3)}
              className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {photos.length < 1 ? "Add at least 1 photo" : "Delivery Confirmed → Get Signature"}
            </button>
          </>
        )}

        {/* STEP 3 — Signature + Complete */}
        {step === 3 && (
          <>
            <InfoCard title="Customer Signature" icon="✍️">
              <p className="text-sm text-brand-gray mb-3">
                Have the customer sign below to confirm delivery.
              </p>
              <SignaturePad onSigned={() => setSigned(true)} signed={signed} />
            </InfoCard>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-brand-dark text-sm mb-3">Job Summary</h3>
              <div className="space-y-1.5 text-sm">
                <Row label="Customer" value={job.customerName} />
                <Row label="Trailer" value={job.trailerSize} />
                <Row label="Photos" value={`${photos.length} taken`} />
                <Row label="Signature" value={signed ? "✅ Obtained" : "⏳ Pending"} />
                <Row label="Base Pay" value={`$${(job.earnings / 100).toFixed(2)}`} />
              </div>
            </div>

            <button
              type="button"
              disabled={!signed || completing}
              onClick={completeJob}
              className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Completing…
                </span>
              ) : !signed ? "Obtain customer signature first" : "Complete Job 🎉"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-brand-dark text-sm">{title}</h3>
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-brand-gray">{label}</span>
      <span className="font-semibold text-brand-dark">{value}</span>
    </div>
  );
}

function PhotoCapture({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (dataUrl: string) => void;
  onRemove: (i: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAdd(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {photos.map((p, i) => (
          <div key={i} className="relative aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt={`Photo ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < 6 && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-2xl text-brand-gray hover:border-brand-orange hover:text-brand-orange transition-colors"
          >
            +
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <p className="text-xs text-brand-gray">{photos.length}/6 photos · {6 - photos.length} remaining</p>
    </div>
  );
}

function SignaturePad({ onSigned, signed }: { onSigned: () => void; signed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasStrokes = useRef(false);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    if (signed) return;
    drawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault();
  }, [signed]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawing.current || signed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#3E3E3E";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasStrokes.current = true;
    e.preventDefault();
  }, [signed]);

  const stopDraw = useCallback(() => { drawing.current = false; }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDraw);
    };
  }, [startDraw, draw, stopDraw]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokes.current = false;
  }

  function confirmSignature() {
    if (!hasStrokes.current) return;
    onSigned();
  }

  if (signed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-700 font-semibold text-sm">✅ Signature obtained</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative">
        <canvas
          ref={canvasRef}
          width={340}
          height={160}
          className="w-full touch-none cursor-crosshair"
          style={{ display: "block" }}
        />
        <p className="absolute bottom-2 right-3 text-xs text-gray-300 pointer-events-none">
          Sign here
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={clearCanvas}
          className="text-xs text-brand-gray border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={confirmSignature}
          className="text-xs text-brand-orange font-semibold border border-brand-orange/30 rounded-lg px-3 py-1.5 hover:bg-brand-orange/5"
        >
          Confirm Signature
        </button>
      </div>
    </div>
  );
}
