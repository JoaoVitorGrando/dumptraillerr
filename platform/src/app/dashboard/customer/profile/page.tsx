"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CustomerProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
      }
    });
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), phone: phone.trim() },
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Profile</h1>
        <p className="text-brand-gray mt-1 text-sm">Update your personal information.</p>
      </div>

      <div className="max-w-lg bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <Field
            label="Full Name"
            type="text"
            value={fullName}
            onChange={setFullName}
            autoComplete="name"
            placeholder="Jane Smith"
          />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={() => {}}
            disabled
            hint="Email cannot be changed here. Contact support if needed."
          />
          <Field
            label="Phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
            placeholder="+1 (206) 555-0100"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}
          {saved && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
              ✅ Profile saved successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="mt-8 max-w-lg bg-white rounded-xl border border-red-100 p-6">
        <h2 className="font-bold text-red-600 mb-1 text-sm">Danger Zone</h2>
        <p className="text-xs text-brand-gray mb-4">
          Deleting your account is permanent. All bookings and history will be removed.
        </p>
        <button
          type="button"
          className="text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors"
          onClick={() => alert("Please contact support to delete your account.")}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  disabled,
  hint,
  autoComplete,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors disabled:bg-gray-50 disabled:text-brand-gray"
      />
      {hint && <p className="text-xs text-brand-gray mt-1">{hint}</p>}
    </div>
  );
}
