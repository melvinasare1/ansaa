import { redirect } from "next/navigation";
import { ansaaMomoDetails, PLAN_LABELS, SELLER_STATUS_LABELS } from "@/lib/billing";
import { getDashboardSession } from "@/lib/seller";
import { PRICING_TIER_BASE_FEE_CEDIS } from "@ansaa/shared/types";

export default async function BillingPage() {
  const session = await getDashboardSession();
  if (!session) {
    redirect("/login");
  }

  const seller = session.seller;
  const momo = ansaaMomoDetails();
  const planName = seller ? PLAN_LABELS[seller.pricingTier] : "Not set";
  const priceCedis = seller
    ? seller.baseFeeCedis || PRICING_TIER_BASE_FEE_CEDIS[seller.pricingTier]
    : null;
  const priceLabel = priceCedis != null ? `${priceCedis} GHS / month` : "Not set";
  const billingReference = seller?.billingReference ?? "Not available";

  return (
    <div className="max-w-2xl px-4 py-4 md:py-6 lg:px-6">
      <p className="text-sm text-ink-700/50">
        Pay Ansaa by Mobile Money. We mark your account active once the payment is confirmed.
      </p>

      <section className="mt-6 rounded-xl border border-wire bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Current plan</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <BillingRow label="Plan" value={planName} />
          <BillingRow label="Price" value={priceLabel} />
          <BillingRow
            label="Status"
            value={seller ? SELLER_STATUS_LABELS[seller.status] : "Not set"}
          />
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-wire bg-white p-6">
        <h2 className="font-display text-base font-semibold text-ink-950">Pay by Mobile Money</h2>
        <p className="mt-2 text-sm text-ink-700/60">
          Send {priceLabel} to Ansaa&apos;s MoMo number. Quote your payment reference every time so
          we can match it to this account.
        </p>

        <dl className="mt-5 space-y-4 text-sm">
          <BillingRow label="MoMo name" value={momo.accountName} />
          <BillingRow label="MoMo number" value={momo.number} mono />
          <BillingRow label="Amount" value={priceLabel} />
        </dl>

        <div className="mt-5 rounded-lg border border-brand/20 bg-brand-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Your payment reference — include this when you send payment
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.2em] text-ink-950">
            {billingReference}
          </p>
        </div>

        {!momo.configured ? (
          <p className="mt-4 rounded-lg border border-wire bg-mist px-4 py-3 text-sm text-ink-700">
            Ansaa&apos;s MoMo number is not published yet. Save your reference and wait for us to
            share payment details.
          </p>
        ) : null}
      </section>

      <p className="mt-6 text-sm text-ink-700/60">
        Your account will be marked active once we confirm the payment on our end. There is no
        self-serve &ldquo;I&apos;ve paid&rdquo; button yet.
      </p>
    </div>
  );
}

function BillingRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-wire pb-4 last:border-0 last:pb-0">
      <dt className="text-sm font-medium text-ink-950">{label}</dt>
      <dd className={mono ? "font-mono text-sm font-semibold text-ink-950" : "text-sm text-ink-700/70"}>
        {value}
      </dd>
    </div>
  );
}
