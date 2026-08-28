import { Check } from "lucide-react";
import { sellerOnboardingHref } from "@/components/marketing/nav";

const steps = [
  {
    n: "01",
    title: "Pick a template",
    body: "Choose from five storefront templates and put your shop on your own domain. Your catalogue, your look, live in a few steps.",
  },
  {
    n: "02",
    title: "Run the business as normal",
    body: "Add products, take orders, keep selling wherever your customers already find you. Everything lands in your admin dashboard.",
  },
  {
    n: "03",
    title: "Buyers pay you directly",
    body: "Customers send MoMo to you. You mark each order paid, unpaid, or cancelled in the dashboard, with no payment processor in the middle.",
  },
  {
    n: "04",
    title: "Pack it yourself, or hand it over",
    body: "Stay on Website & Admin and handle packing on your own. When you want us to store, pack, and dispatch every order, move up to Fulfilment.",
  },
];

const websiteFeatures = [
  "Storefront on your own domain",
  "Pick from 5 templates",
  "Admin dashboard for orders, products, and sales",
  "Manual MoMo payments. You mark orders paid, unpaid, or cancelled",
  "Email support",
];

const fulfilmentFeatures = [
  "Everything in Website & Admin",
  "We store your stock",
  "We pack and dispatch every order",
  "Photo proof at intake and before dispatch",
  "Priority support",
];

const templates = [
  {
    name: "Studio",
    description: "Minimal boutique layout, for fashion and beauty sellers.",
  },
  {
    name: "Market",
    description: "Dense bold grid, for electronics and general goods.",
  },
  {
    name: "Homedine",
    description: "Warm editorial layout, for home and kitchen goods.",
  },
  {
    name: "Stylehive",
    description: "Monochrome streetwear layout, for apparel sellers.",
  },
  {
    name: "Atelier",
    description: "Fifth storefront template, coming soon.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-ink-950">
      {/* Hero */}
      <section className="border-b border-wire">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-navy">
            Storefront first. Fulfilment if you want it.
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
            Your own shop online. Run it yourself, or let us pack and send.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-700">
            Get a storefront on your domain and an admin dashboard you run
            yourself. When packing starts competing with the rest of your day,
            add Fulfilment and we&apos;ll pack and send every order for you.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={sellerOnboardingHref()}
              className="rounded-full bg-navy px-7 py-3 font-medium text-white transition hover:bg-navy/90"
            >
              Get your website now
            </a>
            <a href="#pricing" className="text-sm text-navy underline underline-offset-4">
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold">How it works</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.n} className="border-l border-wire pl-6">
              <span className="font-mono text-sm text-navy">{s.n}</span>
              <h3 className="mt-2 font-display text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 border-y border-wire bg-canvas">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="font-display text-3xl font-semibold">Pricing</h2>
          <p className="mt-3 max-w-xl text-ink-700">
            Start with a storefront you run yourself. Add Fulfilment when you
            want us to pack and send every order.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-wire bg-white p-8">
              <h3 className="font-display text-2xl font-semibold">Website & Admin</h3>
              <p className="mt-2 text-sm text-ink-700">Your own storefront, run it yourself.</p>
              <p className="mt-6 font-display text-4xl font-semibold">
                250 GHS
                <span className="ml-1 text-lg font-medium text-ink-700">/ month</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {websiteFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-800">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy" strokeWidth={2.25} />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={sellerOnboardingHref()}
                className="mt-8 inline-flex items-center justify-center rounded-full border border-navy px-6 py-3 text-sm font-medium text-navy transition hover:bg-navy hover:text-white"
              >
                Get Website & Admin
              </a>
            </article>

            <article className="relative flex flex-col rounded-2xl border border-navy bg-navy/5 p-8">
              <span className="absolute -top-3 right-6 rounded-full bg-navy px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-white">
                Most complete
              </span>
              <h3 className="font-display text-2xl font-semibold">Fulfilment</h3>
              <p className="mt-2 text-sm text-ink-700">
                Everything above, plus we pack and send every order.
              </p>
              <p className="mt-6 font-display text-4xl font-semibold">
                400 GHS
                <span className="ml-1 text-lg font-medium text-ink-700">/ month</span>
              </p>
              <p className="mt-1 font-mono text-xs font-medium uppercase tracking-wide text-navy">Intro price</p>
              <ul className="mt-8 flex-1 space-y-3">
                {fulfilmentFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-800">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy" strokeWidth={2.25} />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={sellerOnboardingHref()}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-medium text-white transition hover:bg-navy/90"
              >
                Get Fulfilment
              </a>
            </article>
          </div>

          <p className="mt-6 text-center text-xs text-ink-700">
            Storage and stock details vary by business and are discussed on a call.
          </p>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold">Pick a template</h2>
        <p className="mt-3 max-w-xl text-ink-700">
          Five storefront designs, ready to launch on your own domain.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {templates.map((template, index) => (
            <article
              key={template.name}
              className={`flex flex-col rounded-2xl border border-wire bg-white p-6 lg:col-span-2 ${
                index === 3 ? "lg:col-start-2" : ""
              }`}
            >
              <div
                className="aspect-[4/3] w-full rounded-xl bg-canvas"
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-xl font-semibold">{template.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">
                {template.description}
              </p>
              <button
                type="button"
                className="mt-5 self-start rounded-full border border-navy px-4 py-1.5 text-sm font-medium text-navy transition hover:bg-navy hover:text-white"
              >
                Preview
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section id="who-its-for" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold">Who this is for</h2>
        <p className="mt-4 max-w-2xl text-ink-700">
          Sellers who already have their business in order, with real stock, real
          customers, and want a storefront they can run themselves. Some stay
          on Website & Admin and pack their own orders. Others add Fulfilment
          so packing and dispatch don&apos;t compete with the rest of the day.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Fashion", "Beauty & cosmetics", "Phone accessories", "Home goods", "Baby items", "Stationery"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-wire px-4 py-1.5 text-sm text-ink-700"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-wire">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl font-semibold">
            Tell us about your business
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-700">
            We&apos;re onboarding a first cohort now. Whether you want Website
            &amp; Admin only or Fulfilment as well. No commitment yet. Let us
            know you&apos;re interested and we&apos;ll follow up when we&apos;re
            ready to launch.
          </p>
          <a
            href={sellerOnboardingHref()}
            className="mt-8 inline-block rounded-full bg-navy px-7 py-3 font-medium text-white transition hover:bg-navy/90"
          >
            Get your website
          </a>
        </div>
      </section>
    </main>
  );
}
