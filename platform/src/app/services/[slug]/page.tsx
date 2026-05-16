import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findPublicService } from "@/data/services";
import Trailers from "@/components/Trailers";
import BookingForm from "@/components/BookingForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = findPublicService(slug);
  if (!service) return {};
  return {
    title: `${service.name} Rental — FAGU Home Services`,
    description: service.short,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = findPublicService(slug);
  if (!service) notFound();

  // The dump-trailer page is the MVP — full content including booking flow.
  // Other services show a "coming soon" layout (future phases).
  if (!service.available) {
    return (
      <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
        <section className="py-20 sm:py-28 bg-grid-dark text-white text-center">
          <div className="container-page max-w-2xl">
            <span className="section-eyebrow inline-block">{service.badge}</span>
            <h1 className="section-title">{service.name}</h1>
            <p className="mt-4 text-white/75 text-lg">{service.short}</p>
            <Link href="/partner/customer" className="btn-primary mt-8 inline-flex">
              Join the waitlist
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-grid-dark">
      <section className="relative isolate overflow-hidden bg-grid-dark text-white pt-40 sm:pt-44 md:pt-52 pb-16 sm:pb-20 md:pb-28">
        <div aria-hidden className="absolute top-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />
        <div className="container-page relative grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 lg:gap-4 items-center">
            <div className="min-w-0 lg:pr-3">
              <h1 className="text-[2.4rem] xs:text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.4rem] font-extrabold leading-[0.96] uppercase max-w-none">
                Dump trailer
                <br className="hidden sm:inline" /> rental:{" "}
                <span className="text-brand-yellow">fast, simple, secure.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">
                {service.short}
              </p>
              <p className="mt-2 text-sm sm:text-base text-brand-yellow font-semibold">
                Roofing tear-offs, construction debris and full cleanouts.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["12 ft", "14 ft", "16 ft", "18 ft", "20 ft"].map((size) => (
                  <span key={size} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {size}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href="#booking" className="btn-primary w-full sm:w-auto">
                  Reserve a trailer
                </a>
                <a href="#booking" className="btn-outline-light w-full sm:w-auto">
                  See sizes & pricing
                </a>
              </div>
            </div>

            <div className="min-w-0">
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 shadow-2xl">
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-72 sm:h-[23rem] md:h-[29rem] lg:h-[35rem] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        <div aria-hidden className="absolute bottom-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />
      </section>
      <Trailers />
      <BookingForm />
    </main>
  );
}
