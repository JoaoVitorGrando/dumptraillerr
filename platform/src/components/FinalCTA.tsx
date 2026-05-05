import Link from "next/link";
import { API_CONFIG } from "@/config/api";

export default function FinalCTA() {
  const phone = API_CONFIG.contact.phone;
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <section className="relative overflow-hidden bg-brand-yellow text-brand-dark">
      <div className="absolute inset-x-0 top-0 h-2 sm:h-3 bg-hazard-stripes opacity-90" />
      <div className="container-page py-16 sm:py-20 md:py-24 grid lg:grid-cols-[1.5fr,1fr] items-center gap-6 lg:gap-8">
        <div>
          <span className="inline-block bg-brand-dark text-brand-yellow font-semibold uppercase tracking-[0.18em] text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
            Ready to Roll
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase font-display leading-[1.05]">
            Pick the trailer you need. We handle the rest.
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-brand-dark/80 max-w-2xl">
            Book a dump trailer in minutes, or partner with FAGU as an owner,
            customer or driver — every flow is just one click away.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <Link
            href="/services/dump-trailer#booking"
            className="btn-secondary w-full sm:w-auto text-center whitespace-nowrap"
          >
            Book a Dump Trailer
          </Link>
          <Link
            href="/partner"
            className="btn-outline-light w-full sm:w-auto text-center !border-brand-dark/30 !text-brand-dark hover:!bg-brand-dark/10 whitespace-nowrap"
          >
            Partner with FAGU
          </Link>
          <a
            href={phoneHref}
            className="text-sm font-semibold text-brand-dark/70 hover:text-brand-dark text-center sm:text-right"
          >
            Or call us: {phone}
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2 sm:h-3 bg-hazard-stripes opacity-90" />
    </section>
  );
}
