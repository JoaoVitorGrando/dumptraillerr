"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserRole = "customer" | "owner" | "driver" | "admin";

function normalizeRole(value: unknown): UserRole {
  const role = String(value ?? "").toLowerCase();
  if (role === "owner" || role === "driver" || role === "admin") return role;
  return "customer";
}

function getRoleHome(role: UserRole) {
  if (role === "admin") return "/admin";
  return `/dashboard/${role}`;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Wrong email or password. Please try again."
          : authError.message
      );
      setLoading(false);
    } else {
      if (redirectTo && redirectTo !== "/") {
        router.push(redirectTo);
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const role = normalizeRole(userData.user?.user_metadata?.role);
        router.push(getRoleHome(role));
      }
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-[0_0_0_2px_rgba(235,114,49,0.32),0_25px_60px_-20px_rgba(235,114,49,0.55)] p-10">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-hazard-stripes" />
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-brand-orange/10 blur-2xl pointer-events-none" />
        <h1 className="font-display text-4xl font-bold text-brand-dark mb-1">
          Welcome back
        </h1>
        <p className="text-brand-gray text-base mb-8">
          Sign in to your FAGU account
        </p>

        <form onSubmit={handlePasswordLogin} className="space-y-5">
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
              className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-brand-orange hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-4 py-3.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <Spinner />
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/signup${redirectTo !== "/" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
            className="text-brand-orange font-semibold hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>

      {/* Demo notice */}
      <p className="mt-4 text-center text-xs text-white/55 opacity-90">
        Auth requires Supabase configuration.{" "}
        <span className="italic">Platform in setup mode.</span>
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
