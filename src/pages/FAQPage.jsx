import { useEffect } from "react";
import { Link } from "react-router-dom";
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

      <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-orange">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-dark">FAQ</span>
          </nav>
        </div>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
