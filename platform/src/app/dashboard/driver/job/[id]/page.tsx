import { notFound } from "next/navigation";
import DeliveryFlow from "@/components/driver/DeliveryFlow";
import { DEMO_JOBS } from "@/data/demo";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: Props) {
  const { id } = await params;
  const job = DEMO_JOBS.find((j) => j.id === id);
  if (!job) notFound();

  return <DeliveryFlow job={job} />;
}
