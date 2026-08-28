"use client";

import { Plus } from "lucide-react";
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
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/80"
    >
      <Plus className="h-4 w-4" strokeWidth={2.25} />
    </button>
  );
}
