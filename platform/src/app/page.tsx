import Hero from "@/components/Hero";
import ServicesCarousel from "@/components/ServicesCarousel";
import PartnerTeaser from "@/components/PartnerTeaser";
import FinalCTA from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <ServicesCarousel />
      <PartnerTeaser />
      <FinalCTA />
    </main>
  );
}
