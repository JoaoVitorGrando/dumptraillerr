import { TRAILERS } from "../data/trailers";
import TrailerCard from "./TrailerCard";

// Section that lists the available trailers. When a trailer is selected,
// we dispatch a custom event so the BookingForm picks it up and we
// scroll the user to the booking section.
export default function Trailers() {
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
              Choose the trailer{" "}
              <span className="text-brand-orange">that fits your job.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
              Four reliable sizes built for the toughest construction,
              renovation, roofing tear-offs and cleanout work.
            </p>
          </div>
          <a
            href="#booking"
            className="btn-secondary self-start md:self-auto w-full sm:w-auto"
          >
            Check Availability
          </a>
        </div>

        <div className="mt-10 sm:mt-12 grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {TRAILERS.map((t) => (
            <TrailerCard key={t.id} trailer={t} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}
