"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function CartLink({ href }: { href: string }) {
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;

  return (
    <Link
      href={href}
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      className="rounded bg-[#1447E6] px-4 py-1.5 text-white"
    >
      Cart{count > 0 ? ` · ${count}` : ""}
    </Link>
  );
}
