import Partner from "@/components/Partner";

export const metadata = {
  title: "Partner With FAGU — Owners, Customers & Drivers",
  description:
    "Three ways to grow with FAGU. Become a trailer owner, open a customer account, or apply to drive.",
};

export default function PartnerPage() {
  return (
    <main className="flex-1">
      <Partner initialTab="owner" />
    </main>
  );
}
