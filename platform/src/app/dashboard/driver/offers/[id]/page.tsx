import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AcceptOfferButton from "@/components/driver/AcceptOfferButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DriverOfferDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/driver");

  const role = String(user.user_metadata?.role ?? "").toLowerCase();
  if (role !== "driver") redirect("/dashboard/customer");

  const offer = await prisma.booking.findFirst({
    where: {
      id,
      status: "CONFIRMED",
      driverId: null,
      notes: { contains: "provider=DRIVER_MARKETPLACE" },
    },
    select: {
      id: true,
      serviceDate: true,
      pickupDate: true,
      deliveryAddress: true,
      deliveryWindow: true,
      materialType: true,
      loads: true,
      notes: true,
      trailer: { select: { name: true, size: true } },
      customer: { select: { user: { select: { email: true } } } },
    },
  });

  if (!offer) notFound();

  return (
    <div className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1px]">
      <div className="h-full w-full overflow-y-auto p-3 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl rounded-[28px] border border-gray-200 bg-white p-5 sm:p-7 shadow-2xl">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-gray-200" />

          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">
                New Delivery Available
              </h1>
              <p className="text-sm sm:text-base text-brand-gray mt-1">
                Accept now and start a great run.
              </p>
            </div>
            <Link
              href="/dashboard/driver"
              aria-label="Close modal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-orange hover:bg-brand-orange/10 transition-colors"
            >
              <span className="text-2xl leading-none">×</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-brand-orange/30 bg-white p-4 sm:p-5">
            <div className="grid grid-cols-[40px_1fr] gap-3">
              <div className="relative flex flex-col items-center">
                <span className="mt-1 h-4 w-4 rounded-full bg-brand-orange ring-4 ring-brand-orange/15" />
                <span className="my-2 h-10 border-l-2 border-dashed border-brand-orange/60" />
                <span className="h-4 w-4 rounded-full border-2 border-brand-orange bg-white" />
              </div>
              <div className="space-y-4">
                <div>
                  <span className="inline-flex rounded-md bg-brand-orange/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                    Pickup
                  </span>
                  <p className="mt-1 text-base sm:text-xl font-semibold text-brand-dark">
                    Trailer owner pickup point
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <span className="inline-flex rounded-md bg-brand-orange/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                    Delivery
                  </span>
                  <p className="mt-1 text-base sm:text-xl font-semibold text-brand-dark break-words">
                    {offer.deliveryAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 bg-brand-light/25 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 text-sm sm:text-base">
              <span className="text-brand-gray">Receiver contact</span>
              <span className="font-semibold text-brand-dark break-all text-right">
                {offer.customer.user.email}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-brand-gray text-sm sm:text-base">Delivery payout</span>
              <span className="font-display text-3xl font-bold text-brand-orange">$40.00</span>
            </div>
          </div>

          <div className="mt-5">
            <AcceptOfferButton offerId={offer.id} />
            <p className="text-[11px] text-brand-gray mt-2 text-center">
              After acceptance, you are assigned to this delivery and can proceed to trailer pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
