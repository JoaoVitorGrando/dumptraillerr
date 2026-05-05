"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DriverProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [license, setLicense] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? "");
        setFullName((user.user_metadata?.full_name as string) ?? "");
        setPhone((user.user_metadata?.phone as string) ?? "");
        setVehicle((user.user_metadata?.vehicle as string) ?? "");
        setLicense((user.user_metadata?.license as string) ?? "");
      }
    });
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        vehicle: vehicle.trim(),
        license: license.trim(),
      },
    });

    if (updateError) setError(updateError.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  const cls = "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors disabled:bg-gray-50 disabled:text-brand-gray";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Driver Profile</h1>
        <p className="text-brand-gray mt-1 text-sm">Keep your information up to date.</p>
      </div>

      <div className="max-w-lg bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <F label="Full Name"><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={cls} autoComplete="name" /></F>
          <F label="Email" hint="Contact support to change email."><input type="email" value={email} disabled className={cls} /></F>
          <F label="Phone"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cls} autoComplete="tel" /></F>
          <F label="Vehicle (Year Make Model)" hint="e.g. 2020 Ford F-250"><input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={cls} /></F>
          <F label="Driver License Number"><input type="text" value={license} onChange={(e) => setLicense(e.target.value)} className={cls} /></F>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{error}</div>}
          {saved && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">✅ Saved!</div>}

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-brand-gray mt-1">{hint}</p>}
    </div>
  );
}
