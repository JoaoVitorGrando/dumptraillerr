import FAQ from "@/components/FAQ";

export const metadata = {
  title: "FAQ — FAGU Home Services",
  description: "Frequently asked questions about dump trailer rental, pricing, delivery and more.",
};

export default function FAQPage() {
  return (
    <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
      <FAQ />
    </main>
  );
}
