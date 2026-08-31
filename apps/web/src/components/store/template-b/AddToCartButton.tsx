"use client";

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
      className="text-xs font-extrabold uppercase text-[#1447E6] hover:underline"
    >
      {added ? "Added" : "Add"}
    </button>
  );
}
