"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completeSellerProfile } from "@/app/signup-seller/actions";
import { slugifyStoreName } from "@/lib/store-slug";

export default function CompleteSellerProfileForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [storeSlug, setStoreSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const result = await completeSellerProfile({
        businessName: String(form.get("businessName") ?? ""),
        storeSlug: String(form.get("storeSlug") ?? ""),
        phone: String(form.get("phone") ?? ""),
        template: form.get("template") === "template-b" ? "template-b" : "template-a",
      });

      if (!result || typeof result !== "object") {
        setError("Could not create the seller profile. Try again.");
        return;
      }

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the seller profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink-950 px-6 py-24 text-canvas">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">Finish setup</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Complete your seller profile</h1>
        <p className="mt-3 text-canvas/60">
          Your login exists, but there is no matching row in{" "}
          <span className="font-mono text-canvas/80">sellers</span> yet. Fill this in to attach one
          — the dashboard will stay broken until this succeeds.
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
            <span className="text-sm text-canvas/70">Phone</span>
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-signal px-7 py-3 font-medium text-ink-950 transition hover:bg-signal/90 disabled:opacity-50"
          >
            {loading ? "Saving profile…" : "Create seller profile"}
          </button>
        </form>

        <p className="mt-8 text-sm text-canvas/50">
          Need to use a different account?{" "}
          <Link href="/login" className="text-signal underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
