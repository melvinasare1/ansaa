"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@ansaa/shared/supabase/client";
import { getWebUrl } from "@ansaa/shared/supabase/env";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    const password = String(new FormData(form).get("password") ?? "");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink-950 px-6 py-24 text-canvas">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">Seller access</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Log in to your dashboard</h1>
        <p className="mt-3 text-canvas/60">
          Use the email and password Fulfil set up for your store. Storefronts stay public — this
          is only for the seller backend.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="text-sm text-canvas/70">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="text-sm text-canvas/70">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-signal px-7 py-3 font-medium text-ink-950 transition hover:bg-signal/90 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-sm text-canvas/50">
          Already onboarded?{" "}
          <Link href="/signup-seller" className="text-signal underline underline-offset-4">
            Create your seller login
          </Link>
        </p>
        <p className="mt-3 text-sm text-canvas/50">
          Not onboarded yet?{" "}
          <Link href={`${getWebUrl()}/signup`} className="text-signal underline underline-offset-4">
            Join the early access list
          </Link>
        </p>
      </div>
    </main>
  );
}
