import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findPublicService } from "@/data/services";
import Trailers from "@/components/Trailers";
import BookingForm from "@/components/BookingForm";
import Rules from "@/components/Rules";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";

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
            <a href="/partner/customer" className="btn-primary mt-8 inline-flex">
              Join the waitlist
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
      <Trailers />
      <BookingForm />
      <Rules />
      <Benefits />
      <HowItWorks />
      <FAQ />
    </main>
  );
}
