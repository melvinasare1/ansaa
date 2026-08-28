"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartLink({ href }: { href: string }) {
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;

  return (
    <Link
      href={href}
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      className="relative p-1"
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
      {count > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
