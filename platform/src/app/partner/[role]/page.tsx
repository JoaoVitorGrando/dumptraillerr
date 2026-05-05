import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Partner, { PARTNER_TABS_INDEX, type PartnerTab } from "@/components/Partner";

interface Props {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const titles: Record<string, string> = {
    owner: "Trailer Owners — Partner With FAGU",
    customer: "Customer Account — Partner With FAGU",
    driver: "Drive for FAGU — Partner With FAGU",
  };
  return { title: titles[role] ?? "Partner With FAGU" };
}

export default async function PartnerRolePage({ params }: Props) {
  const { role } = await params;
  if (!PARTNER_TABS_INDEX.includes(role as PartnerTab)) notFound();

  return (
    <main className="flex-1">
      <Partner initialTab={role as PartnerTab} />
    </main>
  );
}
