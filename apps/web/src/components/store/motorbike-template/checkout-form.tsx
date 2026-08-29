"use client";

import { useState, type FormEvent } from "react";
import {
  getRideDemoProduct,
  isRideDemoProductId,
  RIDE_DEMO_MOMO_NUMBER,
} from "@/components/store/motorbike-template/demo-catalog";
import type { CartItem } from "@/lib/cart-context";
import {
  checkoutItemsPayload,
  momoDetails,
  paymentReference,
  submitCheckout,
  type CheckoutSuccess,
} from "@/lib/checkout";
import { formatCedis } from "@/lib/price";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";

const ORANGE = "#E8622C";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldClass =
  "mt-1.5 h-11 w-full rounded-lg border border-[#D9D6CE] bg-[#FFFDFA] px-4 text-sm text-[#141414] outline-none placeholder:text-[#141414]/35 focus:border-[#141414]";

function rideDemoCheckout(items: CartItem[]): { ok: true; receipt: CheckoutSuccess } | { ok: false; error: string } {
  let subtotalCedis = 0;
  for (const item of items) {
    const product = getRideDemoProduct(item.productId);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return { ok: false, error: "Your bag has an invalid item. Remove it and try again." };
    }
    subtotalCedis += product.priceCedis * item.quantity;
  }

  const reference = paymentReference();
  return {
    ok: true,
    receipt: {
      orderId: crypto.randomUUID(),
      paymentReference: reference,
      subtotalCedis,
      momo: momoDetails({
        businessName: DEFAULT_STORE_NAME,
        phone: RIDE_DEMO_MOMO_NUMBER,
        paymentReference: reference,
        subtotalCedis,
      }),
    },
  };
}

export function RideCheckoutForm({
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

    const buyerNameTrimmed = buyerName.trim();
    const buyerEmailTrimmed = buyerEmail.trim().toLowerCase();
    const buyerPhoneTrimmed = buyerPhone.trim();
    const deliveryTrimmed = deliveryAddress.trim();

    if (!buyerNameTrimmed) {
      setError("Please enter your name.");
      setSubmitting(false);
      return;
    }
    if (!buyerEmailTrimmed || !EMAIL_RE.test(buyerEmailTrimmed)) {
      setError("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }
    if (!buyerPhoneTrimmed) {
      setError("Please enter your phone number.");
      setSubmitting(false);
      return;
    }
    if (!deliveryTrimmed) {
      setError("Please enter a delivery address.");
      setSubmitting(false);
      return;
    }

    const demoCount = items.filter((item) => isRideDemoProductId(item.productId)).length;
    if (demoCount > 0 && demoCount < items.length) {
      setError("Your bag has an invalid item. Remove it and try again.");
      setSubmitting(false);
      return;
    }

    const result =
      demoCount === items.length
        ? rideDemoCheckout(items)
        : await submitCheckout({
            storeSlug,
            buyerName: buyerNameTrimmed,
            buyerEmail: buyerEmailTrimmed,
            buyerPhone: buyerPhoneTrimmed,
            deliveryAddress: deliveryTrimmed,
            items: checkoutItemsPayload(items),
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
    <form onSubmit={handleSubmit} className="mt-10">
      <h2
        className="text-[22px] font-extrabold tracking-tight text-[#141414]"
        style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
      >
        Checkout
      </h2>
      <p className="mt-1 text-sm text-[#141414]/50">
        Pay the seller by Mobile Money after you place the order. No card is charged here.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-[#141414]">
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
        <label className="block text-sm font-semibold text-[#141414]">
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
        <label className="block text-sm font-semibold text-[#141414]">
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
        <label className="block text-sm font-semibold text-[#141414]">
          Delivery address
          <textarea
            name="deliveryAddress"
            autoComplete="street-address"
            required
            rows={3}
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            className="mt-1.5 w-full resize-y rounded-lg border border-[#D9D6CE] bg-[#FFFDFA] px-4 py-3 text-sm text-[#141414] outline-none placeholder:text-[#141414]/35 focus:border-[#141414]"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-lg text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: ORANGE }}
      >
        {submitting ? "Placing order…" : "Pay now"}
      </button>
      <p className="mt-4 text-center text-xs text-[#141414]/40">
        Payment is collected upfront. Your order ships once the seller marks it paid.
      </p>
    </form>
  );
}

export function RidePaymentInstructions({
  receipt,
  shopHref,
}: {
  receipt: CheckoutSuccess;
  shopHref: string;
}) {
  const brandName = DEFAULT_STORE_NAME;
  const amount = formatCedis(receipt.subtotalCedis);
  const instructions = receipt.momo.configured
    ? `Send ${amount} by Mobile Money to ${receipt.momo.number} (${brandName}). Use ${receipt.paymentReference} as the reference so the seller can match your payment.`
    : `This store has not published a MoMo number yet. Save reference ${receipt.paymentReference} and wait for payment details. Your order is held as awaiting payment.`;

  return (
    <div className="mt-8 rounded-[24px] border border-[#D9D6CE] bg-[#FFFDFA] p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: ORANGE }}>
        Awaiting payment
      </p>
      <h2
        className="mt-2 text-[24px] font-extrabold tracking-tight text-[#141414]"
        style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
      >
        Pay with Mobile Money
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#141414]/55">{instructions}</p>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#141414]/45">Amount</dt>
          <dd className="font-bold text-[#141414]">{amount}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#141414]/45">MoMo name</dt>
          <dd className="font-semibold text-[#141414]">{brandName}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#141414]/45">MoMo number</dt>
          <dd className="font-mono text-[13px] font-semibold text-[#141414]">{receipt.momo.number}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#141414]/45">Reference</dt>
          <dd className="font-mono text-[13px] font-extrabold text-[#141414]">{receipt.paymentReference}</dd>
        </div>
      </dl>

      <a
        href={shopHref}
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white"
        style={{ backgroundColor: ORANGE }}
      >
        Continue shopping
      </a>
    </div>
  );
}
