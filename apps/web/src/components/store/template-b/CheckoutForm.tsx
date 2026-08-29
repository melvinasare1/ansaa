"use client";

import { useState, type FormEvent } from "react";
import type { CartItem } from "@/lib/cart-context";
import type { CheckoutSuccess } from "@/lib/checkout";
import { checkoutCart } from "@/lib/preview-checkout";
import { formatCedis } from "@/lib/price";

const fieldClass =
  "mt-1.5 h-11 w-full border-2 border-[#0B1220] bg-white px-3 text-sm text-[#0B1220] outline-none focus:border-[#1447E6]";

export function CheckoutForm({
  storeSlug,
  items,
  onSuccess,
}: {
  storeSlug: string;
  items: CartItem[];
  onSuccess: (receipt: CheckoutSuccess) => void;
}) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const result = await checkoutCart({
      storeSlug,
      buyerName,
      buyerEmail,
      buyerPhone,
      deliveryAddress,
      items,
    });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    onSuccess(result.receipt);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h2 className="font-[family-name:var(--font-market)] text-lg font-extrabold uppercase">
        Checkout
      </h2>
      <p className="mt-1 text-sm text-[#0B1220]/55">
        Pay the seller by Mobile Money after you place the order. No card is charged here.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block text-sm font-semibold">
          Full name
          <input
            type="text"
            name="buyerName"
            autoComplete="name"
            required
            value={buyerName}
            onChange={(event) => setBuyerName(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            name="buyerEmail"
            autoComplete="email"
            required
            value={buyerEmail}
            onChange={(event) => setBuyerEmail(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Phone
          <input
            type="tel"
            name="buyerPhone"
            autoComplete="tel"
            required
            value={buyerPhone}
            onChange={(event) => setBuyerPhone(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Delivery address
          <textarea
            name="deliveryAddress"
            autoComplete="street-address"
            required
            rows={3}
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            className="mt-1.5 w-full resize-y border-2 border-[#0B1220] bg-white px-3 py-2 text-sm text-[#0B1220] outline-none focus:border-[#1447E6]"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full bg-[#1447E6] py-3 text-sm font-extrabold uppercase text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Placing order…" : "Pay now"}
      </button>
      <p className="mt-3 text-center text-xs text-[#0B1220]/40">
        Payment is collected upfront. Your order ships once the seller marks it paid.
      </p>
    </form>
  );
}

export function PaymentInstructions({
  receipt,
  shopHref,
}: {
  receipt: CheckoutSuccess;
  shopHref: string;
}) {
  return (
    <div className="mt-6 border-2 border-[#0B1220] bg-[#FFE8A3] p-5">
      <p className="font-[family-name:var(--font-market)] text-xs font-extrabold uppercase tracking-wide text-[#1447E6]">
        Awaiting payment
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-market)] text-xl font-extrabold uppercase">
        Pay with Mobile Money
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#0B1220]/70">{receipt.momo.instructions}</p>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#0B1220]/50">Amount</dt>
          <dd className="font-[family-name:var(--font-market)] font-extrabold">
            {formatCedis(receipt.subtotalCedis)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#0B1220]/50">MoMo name</dt>
          <dd className="font-semibold">{receipt.momo.accountName}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#0B1220]/50">MoMo number</dt>
          <dd className="font-mono text-[13px] font-semibold">{receipt.momo.number}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#0B1220]/50">Reference</dt>
          <dd className="font-mono text-[13px] font-extrabold">{receipt.paymentReference}</dd>
        </div>
      </dl>

      <a
        href={shopHref}
        className="mt-6 inline-flex w-full items-center justify-center bg-[#1447E6] py-3 text-sm font-extrabold uppercase text-white"
      >
        Continue shopping
      </a>
    </div>
  );
}
