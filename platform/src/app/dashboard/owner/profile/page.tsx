"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OwnerProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
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
        setCompany((user.user_metadata?.company as string) ?? "");
      }
    });
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), phone: phone.trim(), company: company.trim() },
    });

    if (updateError) setError(updateError.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Profile</h1>
        <p className="text-brand-gray mt-1 text-sm">Owner account details.</p>
      </div>

      <div className="max-w-lg bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-5">
          {[
            { label: "Full Name", value: fullName, set: setFullName, type: "text", autoComplete: "name" },
            { label: "Email", value: email, set: () => {}, type: "email", disabled: true, hint: "Contact support to change email." },
            { label: "Phone", value: phone, set: setPhone, type: "tel", autoComplete: "tel" },
            { label: "Company / Business Name (optional)", value: company, set: setCompany, type: "text" },
          ].map(({ label, value, set, type, disabled, hint, autoComplete }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                disabled={disabled}
                autoComplete={autoComplete}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors disabled:bg-gray-50 disabled:text-brand-gray"
              />
              {hint && <p className="text-xs text-brand-gray mt-1">{hint}</p>}
            </div>
          ))}

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
