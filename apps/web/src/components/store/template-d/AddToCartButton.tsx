"use client";

import { Check, Plus } from "lucide-react";
import { useAddToCartFeedback } from "@/components/store/cart-feedback";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({
  productId,
  name,
  priceCedis,
  image,
}: {
  productId: string;
  name: string;
  priceCedis: number;
  image: string;
}) {
  const { addItem } = useCart();
  const { added, notifyAdded } = useAddToCartFeedback();

  return (
    <button
      type="button"
      aria-label={added ? `${name} added to cart` : `Add ${name} to cart`}
      onClick={() => {
        addItem({ productId, name, priceCedis, image, quantity: 1 });
        notifyAdded();
      }}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/80"
    >
      {added ? (
        <Check className="h-4 w-4" strokeWidth={2.25} aria-hidden />
      ) : (
        <Plus className="h-4 w-4" strokeWidth={2.25} />
      )}
    </button>
  );
}
