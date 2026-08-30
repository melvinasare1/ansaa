"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PdpFaqs } from "@/components/store/pdp/PdpFaqs";
import { PdpComparePrice, PdpFeaturesList, PdpShortDescription } from "@/components/store/pdp/PdpFeaturesList";
import { imagesForSelection, PdpGallery, PdpQuantity, productFeatures } from "@/components/store/pdp/PdpGallery";
import { PdpReviews } from "@/components/store/pdp/PdpReviews";
import { PdpVariantSelectors } from "@/components/store/pdp/PdpVariantSelectors";
import { MARKET_CHROME } from "@/components/store/pdp/chrome";
import { useCart } from "@/lib/cart-context";
import { cartLineId } from "@/lib/checkout";
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
    const photo = imagesForSelection(product, color, size)[0];

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
          images={imagesForSelection(product, selectedColor, selectedSize)}
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
          <PdpComparePrice
            priceCedis={product.priceCedis}
            compareAtPriceCedis={product.compareAtPriceCedis}
            wrapClassName="mt-1 flex flex-wrap items-baseline gap-2"
            priceClassName="font-[family-name:var(--font-market)] text-xl font-extrabold text-[#1447E6]"
            compareClassName="text-sm font-semibold text-[#0B1220]/40 line-through"
          />
          <PdpShortDescription
            text={product.shortDescription}
            className="mt-3 text-sm text-[#0B1220]/60"
          />
          {product.description ? (
            <p className="mt-4 text-sm text-[#0B1220]/70">{product.description}</p>
          ) : null}

          <PdpFeaturesList
            features={features}
            accent={ACCENT}
            listClassName="mt-4 space-y-2"
            itemClassName="flex items-start gap-2 text-sm text-[#0B1220]/80"
            strokeWidth={2.5}
          />

          <PdpVariantSelectors
            sizes={sizes}
            colors={colors}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSelectSize={setSelectedSize}
            onSelectColor={setSelectedColor}
            sizeLabel="Size"
            colorLabel="Color"
            labelClassName="text-xs font-extrabold uppercase tracking-wide"
            sizeSectionClassName="mt-5"
            colorSectionClassName="mt-5"
            sizeRowClassName="mt-2 flex flex-wrap gap-2"
            sizeButtonClassName={(selected) =>
              selected
                ? "border-2 border-[#0B1220] bg-[#0B1220] px-3 py-1.5 text-sm font-extrabold uppercase text-white"
                : "border-2 border-[#0B1220] bg-white px-3 py-1.5 text-sm font-semibold uppercase"
            }
            colorMode="chip"
            colorWrapClassName="mt-2 flex flex-wrap gap-2"
            colorChipClassName={(selected) =>
              selected
                ? "border-2 border-[#1447E6] bg-[#1447E6] px-3 py-1.5 text-sm font-extrabold uppercase text-white"
                : "border-2 border-[#0B1220] bg-white px-3 py-1.5 text-sm font-semibold uppercase"
            }
          />

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
