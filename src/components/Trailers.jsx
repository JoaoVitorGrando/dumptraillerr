import { useMemo, useState } from "react";
import { TRAILERS } from "../data/trailers";
import TrailerCard from "./TrailerCard";

// Section that lists the available trailers. When a trailer is selected,
// we dispatch a custom event so the BookingForm picks it up and we
// scroll the user to the booking section.
export default function Trailers() {
  const [selectedId, setSelectedId] = useState(TRAILERS[0]?.id ?? "");
  const selectedTrailer = useMemo(
    () => TRAILERS.find((t) => t.id === selectedId) ?? TRAILERS[0],
    [selectedId]
  );

  const handleSelect = (trailer) => {
    window.dispatchEvent(
      new CustomEvent("trailer:select", { detail: { id: trailer.id } })
    );
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="trailers" className="py-16 sm:py-20 md:py-28 bg-brand-light">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 sm:gap-6">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Our Fleet · 12 – 18 ft</span>
            <h2 className="section-title text-brand-dark">
              One trailer card,{" "}
              <span className="text-brand-orange">all sizes.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
              Select the size below to update specs, best-use and details in a
              single minimal card.
            </p>
          </div>
          <a
            href="#booking"
            className="btn-secondary self-start md:self-auto w-full sm:w-auto"
          >
            Check Availability
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
          {TRAILERS.map((t) => {
            const active = t.id === selectedTrailer?.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-brand-yellow bg-brand-yellow text-white"
                    : "border-gray-300 bg-white text-brand-dark hover:border-brand-yellow hover:text-brand-orange"
                }`}
                aria-pressed={active}
              >
                {t.length}
              </button>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8">
          <TrailerCard trailer={selectedTrailer} onSelect={handleSelect} />
        </div>
      </div>
    </section>
  );
}
