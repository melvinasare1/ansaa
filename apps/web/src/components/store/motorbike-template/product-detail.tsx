"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { rideCartHrefFromPath } from "@/components/store/motorbike-template/demo-catalog";
import { MotorbikePlaceholder } from "@/components/store/motorbike-template/placeholders";
import { useCart } from "@/lib/cart-context";
import { formatCedis } from "@/lib/price";
import type { Product } from "@ansaa/shared/types";

const ORANGE = "#E8622C";

export function RideProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { addItem, hydrated } = useCart();
  const [added, setAdded] = useState(false);
  const photo = product.images[0] ?? "";

  function handleAdd() {
    if (!hydrated) return;
    addItem({
      productId: product.id,
      name: product.name,
      priceCedis: product.priceCedis,
      image: photo,
      quantity: 1,
    });
    setAdded(true);
  }

  function handleBuy() {
    handleAdd();
    router.push(rideCartHrefFromPath(pathname));
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] border border-[#D9D6CE] bg-[#E8E6E1]">
        {photo ? (
          <div className="relative h-[85%] w-[85%]">
            <Image
              src={photo}
              alt={product.name}
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-contain"
            />
          </div>
        ) : (
          <MotorbikePlaceholder className="h-[70%] w-[80%]" />
        )}
      </div>

      <div className="lg:pt-4">
        {product.category ? (
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: ORANGE }}>
            {product.category}
          </p>
        ) : null}
        <h1
          className="mt-2 text-[32px] font-extrabold leading-tight tracking-tight text-[#141414] md:text-[40px]"
          style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
        >
          {product.name}
        </h1>
        <p className="mt-3 text-[22px] font-semibold" style={{ color: ORANGE }}>
          {formatCedis(product.priceCedis)}
        </p>
        {product.description ? (
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#141414]/60">{product.description}</p>
        ) : null}

        <div className="mt-8 flex w-full items-center gap-2 sm:w-auto">
          <button
            type="button"
            aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
            onClick={handleAdd}
            disabled={!hydrated}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#141414] text-[#141414] transition-colors hover:bg-[#141414] hover:text-white disabled:cursor-wait disabled:opacity-60"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={handleBuy}
            disabled={!hydrated}
            className="inline-flex h-12 min-w-0 flex-1 items-center justify-center rounded-lg px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 sm:min-w-[220px]"
            style={{ backgroundColor: ORANGE }}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
