import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ServicesCarousel from "../components/ServicesCarousel";
import PartnerTeaser from "../components/PartnerTeaser";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

/* -------------------------------------------------------------------------- */
/* Home — FAGU showcase                                                       */
/* -------------------------------------------------------------------------- */
/* The home page is intentionally minimal: brand intro, the services         */
/* carousel and the partner teaser. All deeper content (sizes, rules,        */
/* booking, payment, FAQ, full partner forms) lives on dedicated routes      */
/* reachable through the header nav and the carousel cards.                  */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const { hash } = useLocation();

  // Smooth-scroll to section if arriving via /#hash (e.g. "#services").
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesCarousel />
        <PartnerTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
