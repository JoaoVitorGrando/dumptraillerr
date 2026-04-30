import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { TRAILERS } from "../data/trailers";
import faguLogo from "../assets/LOGO1.png";

const AUTOPLAY_MS = 5000;

export default function Trailers() {
  const { search } = useLocation();
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const idxRef = useRef(0);
  const fadingRef = useRef(false);
  const pausedRef = useRef(false);
  const touchStartX = useRef(null);

  const goTo = (next) => {
    if (fadingRef.current) return;
    fadingRef.current = true;
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      idxRef.current = next;
      fadingRef.current = false;
      setFading(false);
    }, 220);
  };

  const prev = () => {
    pausedRef.current = true;
    goTo((idxRef.current - 1 + TRAILERS.length) % TRAILERS.length);
  };

  const next = () => {
    pausedRef.current = true;
    goTo((idxRef.current + 1) % TRAILERS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (pausedRef.current || fadingRef.current) return;
      const n = (idxRef.current + 1) % TRAILERS.length;
      fadingRef.current = true;
      setFading(true);
      setTimeout(() => {
        setIdx(n);
        idxRef.current = n;
        fadingRef.current = false;
        setFading(false);
      }, 220);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const modelId = params.get("model");
    if (!modelId) return;
    const modelIndex = TRAILERS.findIndex((t) => t.id === modelId);
    if (modelIndex < 0) return;
    pausedRef.current = true;
    idxRef.current = modelIndex;
    setIdx(modelIndex);
  }, [search]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      pausedRef.current = true;
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const handleSelect = () => {
    window.dispatchEvent(
      new CustomEvent("trailer:select", { detail: { id: TRAILERS[idxRef.current].id } })
    );
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCustom = () => {
    window.dispatchEvent(
      new CustomEvent("trailer:select", { detail: { id: "custom-dump-trailer" } })
    );
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const trailer = TRAILERS[idx];

  return (
    <section id="trailers" className="pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-10 md:pb-12 bg-brand-light">
      <div className="container-page">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 sm:gap-6">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Our Fleet · 12 – 20 ft</span>
            <h2 className="section-title text-brand-dark">
              Choose your dump trailer{" "}
              <span className="text-brand-orange">size.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
              Browse the catalog and select the model that fits your job. Use
              the arrows or swipe to compare sizes and specs.
            </p>
          </div>
          <a
            href="#booking"
            className="btn-secondary w-full sm:w-auto"
          >
            Check Availability
          </a>
        </div>

        {/* Carousel card */}
        <div
          className="mt-8 sm:mt-10"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-opacity duration-[220ms] ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="grid lg:grid-cols-[1.15fr,1fr]">
              {/* ── Image panel ── */}
              <div className="relative bg-brand-dark min-h-[260px] sm:min-h-[340px] lg:min-h-[440px]">
                <img
                  key={trailer.id}
                  src={trailer.image}
                  alt={trailer.imageAlt || trailer.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* gradient */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/20 to-transparent"
                />

                {/* Logo only (no background) */}
                <img
                  src={faguLogo}
                  alt="FAGU"
                  className="absolute bottom-4 left-4 h-12 sm:h-14 w-auto object-contain"
                />
              </div>

              {/* ── Specs panel ── */}
              <div className="flex flex-col p-5 sm:p-6 md:p-8">
                {/* Name + best for */}
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase tracking-tight leading-tight">
                    {trailer.name}
                  </h3>
                  <p className="mt-1.5 text-brand-orange font-semibold text-sm sm:text-base leading-snug">
                    {trailer.bestFor}
                  </p>
                </div>

                {/* Specs grid */}
                <dl className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
                  <SpecBox label="Width" value={trailer.width} />
                  <SpecBox label="Length" value={trailer.length} />
                  <SpecBox label="Side Height" value={trailer.sideHeight} />
                  <SpecBox label="Hitch" value={trailer.hitch} />
                  <SpecBox label="Capacity" value={trailer.capacity} wide />
                  {trailer.gvwr && (
                    <SpecBox label="GVWR" value={trailer.gvwr} wide />
                  )}
                  {trailer.payload && (
                    <SpecBox label="Max Payload" value={trailer.payload} wide />
                  )}
                </dl>

                {/* Highlights */}
                <ul className="mt-4 sm:mt-5 space-y-2">
                  {trailer.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-gray-700 text-sm"
                    >
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-yellow/15 text-brand-orange">
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Electrical tag */}
                <div className="mt-3">
                  <span className="rounded-full bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1">
                    {trailer.electrical}
                  </span>
                </div>

                {/* Price + CTA */}
                <div className="mt-auto pt-5 sm:pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Booking from
                    </p>
                    <p className="font-sans text-2xl sm:text-3xl font-bold tabular-nums text-brand-dark leading-tight">
                      <span className="text-brand-yellow">$</span>
                      {trailer.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelect}
                    className="btn-primary whitespace-nowrap"
                  >
                    Select This Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation — dots + arrows */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <NavBtn onClick={prev} label="Previous trailer">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </NavBtn>

            <div className="flex items-center gap-2">
              {TRAILERS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    pausedRef.current = true;
                    goTo(i);
                  }}
                  aria-label={`Ver ${t.name}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx
                      ? "bg-brand-yellow w-7 h-2.5"
                      : "bg-gray-300 hover:bg-brand-yellow/50 w-2.5 h-2.5"
                  }`}
                />
              ))}
            </div>

            <NavBtn onClick={next} label="Next trailer">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </NavBtn>
          </div>

          {/* Trailer name strip */}
          <div
            className={`mt-2 text-center text-sm font-semibold text-gray-500 transition-opacity duration-[220ms] ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {trailer.name}
          </div>
        </div>

        {/* Custom size banner */}
        <div className="mt-8 rounded-2xl border border-brand-orange/30 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-orange font-semibold">
              Need a different size or capacity?
            </p>
            <p className="mt-1 text-brand-dark text-sm sm:text-base">
              Tell us the model, dimensions and load you need — we'll match the
              right trailer for the job.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCustom}
            className="btn-secondary self-start sm:self-auto whitespace-nowrap"
          >
            Request a custom trailer
          </button>
        </div>
      </div>
    </section>
  );
}

function SpecBox({ label, value, wide }) {
  return (
    <div
      className={`rounded-xl bg-gray-50 border border-gray-100 p-2.5 sm:p-3 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <dt className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400 font-semibold leading-none">
        {label}
      </dt>
      <dd className="mt-1 text-brand-dark font-bold text-sm sm:text-[15px] leading-snug">
        {value}
      </dd>
    </div>
  );
}

function NavBtn({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-gray-200 bg-white text-brand-dark shadow-sm hover:bg-brand-yellow hover:text-white hover:border-brand-yellow transition-colors"
    >
      {children}
    </button>
  );
}
