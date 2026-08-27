"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function AddToBagButton({
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
      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFEFEF] text-black transition-colors hover:bg-[#E4E4E4]"
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
