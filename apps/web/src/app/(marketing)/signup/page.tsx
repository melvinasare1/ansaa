"use client";

import { useState } from "react";

const categories = [
  "Fashion & accessories",
  "Beauty & cosmetics",
  "Phone & tech accessories",
  "Home & lifestyle goods",
  "Baby products",
  "Stationery / books / hobby",
  "Other",
];

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Something went wrong. Try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-canvas">
        <div className="max-w-md text-center">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">You&apos;re on the list</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">Thanks. We&apos;ll be in touch.</h1>
          <p className="mt-3 text-canvas/60">
            We&apos;re lining up the first cohort now. We&apos;ll reach out on the number you gave us as soon
            as we&apos;re ready to onboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink-950 px-6 py-24 text-canvas">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal">Early access</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Tell us about your business</h1>
        <p className="mt-3 text-canvas/60">
          Two minutes, no commitment. We use this to line up the first cohort and confirm pricing works
          for real sellers before we launch.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <Field label="Business name" name="businessName" required />
          <Field label="Your name" name="contactName" required />
          <Field label="Phone number" name="phone" type="tel" required />
          <Field label="Email" name="email" type="email" required />

          <label className="block">
            <span className="text-sm text-canvas/70">Product category</span>
            <select
              name="productCategory"
              required
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <Field
            label="Roughly how many orders a month?"
            name="estimatedMonthlyOrders"
            type="number"
          />

          <label className="block">
            <span className="text-sm text-canvas/70">Anything else we should know?</span>
            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-signal px-7 py-3 font-medium text-ink-950 transition hover:bg-signal/90 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Join the list"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-canvas/70">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 text-canvas outline-none focus:border-signal"
      />
    </label>
  );
}
