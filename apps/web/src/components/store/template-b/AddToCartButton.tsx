"use client";

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

  return (
    <button
      type="button"
      aria-label={`Add ${name} to cart`}
      onClick={() => addItem({ productId, name, priceCedis, image, quantity: 1 })}
      className="text-xs font-extrabold uppercase text-[#1447E6] hover:underline"
    >
      Add
    </button>
  );
}
