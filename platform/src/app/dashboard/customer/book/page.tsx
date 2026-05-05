import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/BookingForm";

export const metadata = { title: "New Booking — FAGU Home Services" };

export default async function CustomerBookPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/customer/book");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">
          New Booking
        </h1>
        <p className="text-brand-gray mt-1 text-sm">
          Reserve your dump trailer — delivery anywhere in the Seattle metro area.
        </p>
      </div>

      <div className="max-w-2xl">
        <BookingForm />
      </div>
    </div>
  );
}
