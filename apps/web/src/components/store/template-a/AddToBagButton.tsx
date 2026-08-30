"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { useCartFeedback } from "@/components/store/template-a/CartFeedback";
import { useCart } from "@/lib/cart-context";

function useAddToCart() {
  const router = useRouter();
  const { addItem, hydrated } = useCart();
  const feedback = useCartFeedback();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function add(
    item: { productId: string; name: string; priceCedis: number; image: string },
    redirectTo?: string
  ) {
    if (!hydrated) return;
    addItem({ ...item, quantity: 1 });
    if (redirectTo) {
      router.push(redirectTo);
      return;
    }
    feedback?.notifyAdded();
    setAdded(true);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setAdded(false), 1600);
  }

  return { add, added, hydrated };
}

export function AddToCartIconButton({
  productId,
  name,
  priceCedis,
  image,
  className,
}: {
  productId: string;
  name: string;
  priceCedis: number;
  image: string;
  className?: string;
}) {
  const { add, added, hydrated } = useAddToCart();

  return (
    <button
      type="button"
      aria-label={added ? `${name} added to cart` : `Add ${name} to cart`}
      disabled={!hydrated}
      onClick={() => add({ productId, name, priceCedis, image })}
      className={
        className ??
        "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-sm"
      }
    >
      {added ? (
        <Check className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
      ) : (
        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}

export function BuyNowButton({
  productId,
  name,
  priceCedis,
  image,
  cartHref,
}: {
  productId: string;
  name: string;
  priceCedis: number;
  image: string;
  cartHref: string;
}) {
  const { add, hydrated } = useAddToCart();

  return (
    <button
      type="button"
      aria-label={`Buy ${name} now`}
      disabled={!hydrated}
      onClick={() => add({ productId, name, priceCedis, image }, cartHref)}
      className="inline-flex h-9 items-center justify-center rounded-full bg-black px-3.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
    >
      Buy Now
    </button>
  );
}
