import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

export default function FAQPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />

      <main className="flex-1">
        <div className="pt-28 sm:pt-32 md:pt-36">
          <FAQ />
        </div>
      </main>

      <Footer />
    </div>
  );
}
