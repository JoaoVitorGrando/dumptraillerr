"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "customer" | "owner" | "driver";

const ROLES: { value: Role; label: string; description: string; icon: string }[] = [
  {
    value: "customer",
    label: "Customer",
    description: "Rent a trailer for your project",
    icon: "🏠",
  },
  {
    value: "owner",
    label: "Trailer Owner",
    description: "List your trailers and earn",
    icon: "🚛",
  },
  {
    value: "driver",
    label: "Driver",
    description: "Deliver trailers and get paid",
    icon: "🗺️",
  },
];

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/";

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 text-3xl">
          ✉️
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
          Confirm your email
        </h2>
        <p className="text-brand-gray text-sm mb-6 leading-relaxed">
          We sent a confirmation link to{" "}
          <span className="font-semibold text-brand-dark">{email}</span>.
          Click it to activate your account and start using FAGU.
        </p>
        <Link href="/auth/login" className="btn-primary inline-flex">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-1">
          Create account
        </h1>
        <p className="text-brand-gray text-sm mb-7">
          Join FAGU Home Services — Seattle&apos;s dump trailer platform
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-7">
          <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? "bg-brand-orange" : "bg-gray-200"}`} />
          <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? "bg-brand-orange" : "bg-gray-200"}`} />
        </div>

        {step === 1 && (
          <div>
            <p className="text-sm font-semibold text-brand-dark mb-4">
              I want to…
            </p>
            <div className="space-y-3 mb-7">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`w-full flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                    role === r.value
                      ? "border-brand-orange bg-brand-orange/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${role === r.value ? "text-brand-orange" : "text-brand-dark"}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-brand-gray">{r.description}</p>
                  </div>
                  {role === r.value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                      <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary w-full"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setStep(1); setError(""); }}
                className="btn-secondary flex-1"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? <Spinner /> : "Create Account"}
              </button>
            </div>

            <p className="text-xs text-brand-gray text-center pt-1">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-brand-orange hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-orange hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-brand-gray border-t border-gray-100 pt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-orange font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
