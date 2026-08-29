"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { PdpFaqs } from "@/components/store/pdp/PdpFaqs";
import { PdpGallery, PdpQuantity, productFeatures } from "@/components/store/pdp/PdpGallery";
import { PdpReviews } from "@/components/store/pdp/PdpReviews";
import { MARKET_CHROME } from "@/components/store/pdp/chrome";
import { useCart } from "@/lib/cart-context";
import { cartLineId } from "@/lib/checkout";
import { formatCedis } from "@/lib/price";
import { fillFromId, swatchHex } from "@/lib/swatch";
import type { Product, StoreFaq } from "@ansaa/shared/types";

const ACCENT = MARKET_CHROME.accent;

export function ProductDetail({
  product,
  faqs,
  children,
}: {
  product: Product;
  faqs: StoreFaq[];
  children?: ReactNode;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const cartHref = "/store/template-b/cart";
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const features = productFeatures(product);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    const size = selectedSize || undefined;
    const color = selectedColor || undefined;
    const variantLabel = [size, color].filter(Boolean).join(" / ");
    const qty = Math.min(99, Math.max(1, Math.floor(quantity) || 1));
    const photo = product.images[0];

    addItem({
      productId: cartLineId(product.id, size, color),
      name: variantLabel ? `${product.name} · ${variantLabel}` : product.name,
      priceCedis: product.priceCedis,
      image: photo || (color ? swatchHex(color) : fillFromId(product.id)),
      size,
      color,
      quantity: qty,
    });
    router.push(cartHref);
  }

  return (
    <div>
      <div className="grid items-start gap-6 sm:grid-cols-2">
        <PdpGallery
          images={product.images}
          alt={product.name}
          accent={ACCENT}
          aspectClass="aspect-square"
          frameClass="border-2 border-[#0B1220] bg-[#0B1220]/10"
          thumbClass="relative flex aspect-square w-16 shrink-0 overflow-hidden border-2 border-[#0B1220] bg-white"
        />
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

          {features.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-[#0B1220]/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} color={ACCENT} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
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

          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-wide">Quantity</p>
            <PdpQuantity
              value={quantity}
              onChange={setQuantity}
              wrapClass="mt-2 inline-flex h-12 items-center border-2 border-[#0B1220] bg-white"
            />
          </div>

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
          <p className="mt-3 text-xs text-[#0B1220]/40">Packed and dispatched with care</p>
        </div>
      </div>

      {children}
      <PdpReviews productId={product.id} chrome={MARKET_CHROME} />
      <PdpFaqs faqs={faqs} chrome={MARKET_CHROME} />
    </div>
  );
}
