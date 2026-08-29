"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import {
  CheckoutForm,
  PaymentInstructions,
} from "@/components/store/template-d/CheckoutForm";
import { useCart } from "@/lib/cart-context";
import type { CheckoutSuccess } from "@/lib/checkout";
import { formatCedis } from "@/lib/price";

function isImageSrc(value: string) {
  return value.startsWith("http") || value.startsWith("/");
}

export default function TemplateDCartPage() {
  const shopHref = "/store/template-d";
  const { items, updateQuantity, removeItem, clearCart, totalCedis, hydrated } = useCart();
  const [receipt, setReceipt] = useState<CheckoutSuccess | null>(null);

  function handleCheckoutSuccess(next: CheckoutSuccess) {
    setReceipt(next);
    clearCart();
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10 md:px-8 md:py-14">
      <h1
        className="text-[28px] font-extrabold tracking-tight md:text-[34px]"
        style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
      >
        Your bag
      </h1>

      {receipt ? (
        <PaymentInstructions receipt={receipt} shopHref={shopHref} />
      ) : !hydrated ? (
        <p className="mt-8 text-sm text-black/45">Loading your bag…</p>
      ) : items.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-black/55">Your bag is empty.</p>
          <Link
            href={shopHref}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-black py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white"
          >
            Continue shopping
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-black/10 border-b border-black/10">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white">
                  {isImageSrc(item.image) ? (
                    <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <span
                      className="block h-full w-full"
                      style={{ backgroundColor: item.image || "#C4C4C4" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold leading-snug">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold">{formatCedis(item.priceCedis)}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full bg-white">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeItem(item.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-black/40 hover:bg-black/5 hover:text-black"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between text-[15px] font-bold">
            <span>Total</span>
            <span>{formatCedis(totalCedis)}</span>
          </div>

          <CheckoutForm
            storeSlug="template-d"
            items={items}
            onSuccess={handleCheckoutSuccess}
          />
        </>
      )}
    </div>
  );
}
