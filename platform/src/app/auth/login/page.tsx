"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "password" | "magic";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/";

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

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
      router.push(redirectTo);
      router.refresh();
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setMagicSent(true);
      setLoading(false);
    }
  }

  if (magicSent) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto mb-5">
          <MailIcon />
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
          Check your inbox
        </h2>
        <p className="text-brand-gray text-sm mb-6 leading-relaxed">
          We sent a magic link to{" "}
          <span className="font-semibold text-brand-dark">{email}</span>.
          Click it to sign in — no password needed.
        </p>
        <button
          onClick={() => {
            setMagicSent(false);
            setEmail("");
          }}
          className="text-brand-orange text-sm font-semibold hover:underline"
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-1">
          Welcome back
        </h1>
        <p className="text-brand-gray text-sm mb-7">
          Sign in to your FAGU account
        </p>

        {/* Mode toggle */}
        <div className="flex rounded-lg bg-brand-light p-1 mb-6">
          <button
            type="button"
            onClick={() => { setMode("password"); setError(""); }}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 ${
              mode === "password"
                ? "bg-white shadow-sm text-brand-dark"
                : "text-brand-gray hover:text-brand-dark"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setMode("magic"); setError(""); }}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 ${
              mode === "magic"
                ? "bg-white shadow-sm text-brand-dark"
                : "text-brand-gray hover:text-brand-dark"
            }`}
          >
            Magic Link
          </button>
        </div>

        <form
          onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
          className="space-y-4"
        >
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

          {mode === "password" && (
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
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-colors"
              />
            </div>
          )}

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
            ) : mode === "password" ? (
              "Sign In"
            ) : (
              "Send Magic Link"
            )}
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
      <p className="mt-4 text-center text-xs text-brand-gray opacity-70">
        Auth requires Supabase configuration.{" "}
        <span className="italic">Platform in setup mode.</span>
      </p>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EB7231"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
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
