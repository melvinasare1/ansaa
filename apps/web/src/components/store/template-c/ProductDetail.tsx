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
  const cartHref = `/store/template-c/${slug}/cart`;
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
    <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-10 md:py-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDE8DC]">
        {photo ? (
          <Image
            src={photo}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 90vw"
            className="object-cover"
            priority
          />
        ) : null}
      </div>
      <div className="md:pt-6">
        <h1
          className="text-[32px] font-medium leading-tight text-[#2B4239] md:text-[40px]"
          style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
        >
          {product.name}
        </h1>
        {product.description ? (
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#2B4239]/55">
            {product.description}
          </p>
        ) : null}
        <p className="mt-5 text-[22px] font-semibold text-[#2B4239]">
          {formatCedis(product.priceCedis)}
        </p>

        {sizes.length > 0 ? (
          <div className="mt-8">
            <p className="text-sm font-semibold text-[#2B4239]">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
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
                        ? "h-10 min-w-[44px] rounded-full bg-[#2B4239] px-4 text-sm font-medium text-[#F5F1E4]"
                        : "h-10 min-w-[44px] rounded-full border border-[#2B4239]/20 bg-white px-4 text-sm font-medium text-[#2B4239]"
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
          <div className="mt-6">
            <p className="text-sm font-semibold text-[#2B4239]">Color</p>
            <div className="mt-3 flex items-center gap-2.5">
              {colors.map((color) => {
                const selected = color === selectedColor;
                const hex = swatchHex(color);
                return (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    aria-pressed={selected}
                    onClick={() => setSelectedColor(color)}
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={selected ? { boxShadow: "0 0 0 1.5px #2B4239" } : undefined}
                  >
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: hex }} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#2B4239] text-sm font-medium text-[#F5F1E4] transition hover:opacity-90"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
