"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpSeller } from "@/app/signup-seller/actions";
import { slugifyStoreName } from "@/lib/store-slug";

export default function SignupSellerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [storeSlug, setStoreSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpSeller({
        email: String(form.get("email") ?? ""),
        password,
        businessName: String(form.get("businessName") ?? ""),
        storeSlug: String(form.get("storeSlug") ?? ""),
        phone: String(form.get("phone") ?? ""),
        template: form.get("template") === "template-b" ? "template-b" : "template-a",
      });

      if (!result || typeof result !== "object") {
        setError("Could not create the account. Try again.");
        return;
      }

      if ("error" in result) {
        setError(result.error);
        if (result.resumeProfile) {
          router.replace("/signup-seller/complete");
        }
        return;
      }

      if (result.needsEmailConfirmation) {
        setCheckEmail(true);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-canvas">
        <div className="max-w-md text-center">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">Check your inbox</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">Confirm your email to finish.</h1>
          <p className="mt-3 text-canvas/60">
            We created your seller profile. Open the confirmation link, then{" "}
            <Link href="/login" className="text-signal underline underline-offset-4">
              log in to your dashboard
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink-950 px-6 py-24 text-canvas">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">Seller account</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Create your dashboard login</h1>
        <p className="mt-3 text-canvas/60">
          For sellers Fulfil has already onboarded. This creates an Auth user and a matching row in{" "}
          <span className="font-mono text-canvas/80">sellers</span> — not the early-access waitlist.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="text-sm text-canvas/70">Business name</span>
            <input
              name="businessName"
              type="text"
              required
              autoComplete="organization"
              onChange={(e) => {
                if (!slugTouched) setStoreSlug(slugifyStoreName(e.target.value));
              }}
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="text-sm text-canvas/70">Store slug</span>
            <input
              name="storeSlug"
              type="text"
              required
              value={storeSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setStoreSlug(slugifyStoreName(e.target.value));
              }}
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 font-mono text-sm text-canvas outline-none focus:border-signal"
            />
            <span className="mt-1.5 block text-xs text-canvas/40">
              Public storefront path: /store/template-a/{storeSlug || "your-store"}
            </span>
          </label>

          <label className="block">
            <span className="text-sm text-canvas/70">Template</span>
            <select
              name="template"
              defaultValue="template-a"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            >
              <option value="template-a">Template A — Minimal</option>
              <option value="template-b">Template B — Market</option>
            </select>
          </label>

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
            <span className="text-sm text-canvas/70">Phone</span>
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="text-sm text-canvas/70">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="text-sm text-canvas/70">Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-signal px-7 py-3 font-medium text-ink-950 transition hover:bg-signal/90 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create seller login"}
          </button>
        </form>

        <p className="mt-8 text-sm text-canvas/50">
          Already have a login?{" "}
          <Link href="/login" className="text-signal underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
