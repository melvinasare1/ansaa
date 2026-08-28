"use client";

import { useSeller } from "@/lib/seller-context";
import { storefrontUrl } from "@/lib/storefront-url";

const templateLabels = {
  "template-a": "Template A — Minimal",
  "template-b": "Template B — Market",
} as const;

const tierLabels = {
  website_admin: "Website & Admin",
  fulfilment: "Fulfilment",
} as const;

export default function SettingsPage() {
  const { seller } = useSeller();
  const storeUrl = storefrontUrl(seller);

  const templateLabel = seller ? templateLabels[seller.template] : "—";
  const billingLabel = seller
    ? `${tierLabels[seller.pricingTier]} — GHS ${seller.baseFeeCedis}/mo base`
    : "—";

  return (
    <div className="max-w-2xl px-4 py-4 md:py-6 lg:px-6">
      <p className="text-sm text-ink-700/50">Your business info and storefront setup.</p>

      <section className="mt-6 rounded-xl border border-wire bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Business</h2>
        <div className="mt-4 space-y-4">
          <SettingRow label="Business name" value={seller?.businessName || "—"} />
          <SettingRow
            label="Storefront domain"
            value={seller?.domain || "—"}
            hint="Your own domain, e.g. yourbrand.com"
          />
          <SettingRow
            label="Dashboard URL"
            value={seller?.domain ? `dashboard.${seller.domain}` : "dashboard.yourbrand.com"}
            hint="Auto-generated, not editable"
          />
          <SettingRow label="Template" value={templateLabel} />
          <SettingRow
            label="Online store"
            value={storeUrl ? "View store" : "Not set up yet"}
            hint="Opens your public shop in a new tab"
            href={storeUrl}
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-wire bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Billing</h2>
        <div className="mt-4 space-y-4">
          <SettingRow label="Pricing tier" value={billingLabel} />
          <SettingRow label="Included orders" value="20 orders / month" />
          <SettingRow label="Overage rate" value="3 GHS / order (21–50), then tiered down" />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-wire bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Returns policy</h2>
        <p className="mt-2 text-sm text-ink-700/60">
          Set your own return policy. Items that arrive damaged or not as described are always
          eligible for return regardless of your policy below.
        </p>
        <textarea
          rows={3}
          placeholder="e.g. No returns on sale items. Full returns within 3 days for everything else."
          className="mt-4 w-full rounded-lg border border-wire px-4 py-3 text-sm outline-none focus:border-signal"
        />
      </section>
    </div>
  );
}

function SettingRow({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-wire pb-4 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-ink-950">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-ink-700/40">{hint}</p> : null}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-ink-700/70">{value}</p>
      )}
    </div>
  );
}
