"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { PdpFaqs } from "@/components/store/pdp/PdpFaqs";
import { PdpGallery, PdpQuantity, productFeatures } from "@/components/store/pdp/PdpGallery";
import { PdpReviews } from "@/components/store/pdp/PdpReviews";
import { STYLEHIVE_CHROME } from "@/components/store/pdp/chrome";
import { useCart } from "@/lib/cart-context";
import { cartLineId } from "@/lib/checkout";
import { formatCedis } from "@/lib/price";
import { fillFromId, isLightSwatch, swatchHex } from "@/lib/swatch";
import type { Product, StoreFaq } from "@ansaa/shared/types";

const ACCENT = STYLEHIVE_CHROME.accent;

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
  const cartHref = "/store/template-d/cart";
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const features = productFeatures(product);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  function handleBuy() {
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
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-12">
      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
        <PdpGallery
          images={product.images}
          alt={product.name}
          accent={ACCENT}
          aspectClass="aspect-[4/5]"
          frameClass="rounded-[28px] bg-white md:rounded-[32px]"
          thumbClass="relative flex aspect-square w-16 shrink-0 overflow-hidden rounded-2xl bg-white"
        />
        <div className="rounded-[28px] bg-white p-8 md:rounded-[32px] md:p-12">
          <h1
            className="text-[32px] font-extrabold leading-tight tracking-tight text-black md:text-[40px]"
            style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
          >
            {product.name}
          </h1>
          {product.description ? (
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-black/55">
              {product.description}
            </p>
          ) : null}

          {features.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[14px] text-black/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} color={ACCENT} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-5 text-[22px] font-extrabold tracking-tight">{formatCedis(product.priceCedis)}</p>

          {sizes.length > 0 ? (
            <div className="mt-8">
              <p className="text-sm font-semibold">Size</p>
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
                          ? "h-10 min-w-[44px] rounded-full bg-black px-4 text-sm font-semibold text-white"
                          : "h-10 min-w-[44px] rounded-full bg-[#F5F5F3] px-4 text-sm font-medium text-black"
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
              <p className="text-sm font-semibold">Color</p>
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
                      style={selected ? { boxShadow: "0 0 0 1.5px #111" } : undefined}
                    >
                      <span
                        className="h-6 w-6 rounded-full"
                        style={{
                          backgroundColor: hex,
                          boxShadow: isLightSwatch(hex) ? "inset 0 0 0 1px rgba(0,0,0,0.08)" : undefined,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-semibold">Quantity</p>
            <PdpQuantity
              value={quantity}
              onChange={setQuantity}
              wrapClass="mt-3 inline-flex h-12 items-center rounded-full bg-[#F5F5F3]"
            />
          </div>

          <button
            type="button"
            onClick={handleBuy}
            className="mt-10 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-black py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white"
          >
            Buy this product
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
          </button>
        </div>
      </div>

      {children}
      <PdpReviews productId={product.id} chrome={STYLEHIVE_CHROME} />
      <PdpFaqs faqs={faqs} chrome={STYLEHIVE_CHROME} />
    </div>
  );
}
