"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";

export function Header({ slug }: { slug: string }) {
  const pathname = usePathname() ?? "";
  const base = `/store/template-c/${slug}`;
  const onHome = pathname === base || pathname === `${base}/`;
  const { totalItems, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;

  return (
    <header className={onHome ? "absolute inset-x-0 top-0 z-20" : "sticky top-0 z-20 bg-[#1F3830]"}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6 py-6 md:px-10">
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-white md:flex">
          <a href={`${base}#shop`}>Shop</a>
          <a href={`${base}#bestsellers`}>Bestsellers</a>
          <a href={`${base}#gallery`}>Gallery</a>
          <a href={`${base}#about`}>About</a>
        </nav>

        <Link
          href={base}
          className="text-center text-[28px] font-medium tracking-[0.04em] text-white md:text-[32px]"
          style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
        >
          {DEFAULT_STORE_NAME}
        </Link>

        <div className="flex items-center justify-end gap-3">
          <label className="relative hidden w-full max-w-[200px] md:block">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              placeholder="Search Product..."
              className="h-10 w-full rounded-full border border-white/35 bg-white/15 px-4 pr-10 text-sm text-white placeholder:text-white/75 outline-none backdrop-blur-sm"
            />
            <Search
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white"
              strokeWidth={1.75}
            />
          </label>
          <Link
            href={`${base}/cart`}
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
            className="relative p-1 text-white"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5F1E4] px-1 text-[10px] font-semibold leading-none text-[#2B4239]">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label="Account"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 text-white"
          >
            <User className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </header>
  );
}
