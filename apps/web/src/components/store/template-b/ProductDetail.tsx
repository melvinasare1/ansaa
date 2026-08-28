"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { cartLineId } from "@/lib/checkout";
import { formatCedis } from "@/lib/price";
import { fillFromId, swatchHex } from "@/lib/swatch";
import type { Product } from "@ansaa/shared/types";

export function ProductDetail({
  product,
  slug,
}: {
  product: Product;
  slug: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const cartHref = `/store/template-b/${slug}/cart`;
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const photo = product.images[0];
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");

  function handleAdd() {
    const size = selectedSize || undefined;
    const color = selectedColor || undefined;
    const variantLabel = [size, color].filter(Boolean).join(" / ");

    addItem({
      productId: cartLineId(product.id, size, color),
      name: variantLabel ? `${product.name} · ${variantLabel}` : product.name,
      priceCedis: product.priceCedis,
      image: photo || (color ? swatchHex(color) : fillFromId(product.id)),
      size,
      color,
      quantity: 1,
    });
    router.push(cartHref);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden border-2 border-[#0B1220] bg-[#0B1220]/10">
        {photo ? (
          <Image
            src={photo}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 50vw, 90vw"
            className="object-cover"
            priority
          />
        ) : null}
      </div>
      <div>
        <h1 className="font-[family-name:var(--font-market)] text-2xl font-extrabold uppercase">
          {product.name}
        </h1>
        <p className="mt-1 font-[family-name:var(--font-market)] text-xl font-extrabold text-[#1447E6]">
          {formatCedis(product.priceCedis)}
        </p>
        {product.description ? (
          <p className="mt-4 text-sm text-[#0B1220]/70">{product.description}</p>
        ) : null}

        {sizes.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-wide">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => {
                const selected = size === selectedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedSize(size)}
                    className={
                      selected
                        ? "border-2 border-[#0B1220] bg-[#0B1220] px-3 py-1.5 text-sm font-extrabold uppercase text-white"
                        : "border-2 border-[#0B1220] bg-white px-3 py-1.5 text-sm font-semibold uppercase"
                    }
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {colors.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-wide">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((color) => {
                const selected = color === selectedColor;
                return (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedColor(color)}
                    className={
                      selected
                        ? "border-2 border-[#1447E6] bg-[#1447E6] px-3 py-1.5 text-sm font-extrabold uppercase text-white"
                        : "border-2 border-[#0B1220] bg-white px-3 py-1.5 text-sm font-semibold uppercase"
                    }
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <p className="mt-4 text-xs font-semibold text-[#0B1220]/50">
          {product.stockQuantity} left
        </p>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-6 w-full bg-[#1447E6] py-3 text-sm font-extrabold uppercase text-white transition hover:opacity-90"
        >
          Add to cart
        </button>
        <p className="mt-3 text-xs text-[#0B1220]/40">
          Packed and dispatched by Fulfil
        </p>
      </div>
    </div>
  );
}
