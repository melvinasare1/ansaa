"use client";

import { useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PdpFaqs } from "@/components/store/pdp/PdpFaqs";
import { PdpComparePrice, PdpFeaturesList, PdpShortDescription } from "@/components/store/pdp/PdpFeaturesList";
import { imagesForSelection, PdpGallery, PdpQuantity, productFeatures } from "@/components/store/pdp/PdpGallery";
import { PdpReviews } from "@/components/store/pdp/PdpReviews";
import { PdpVariantSelectors } from "@/components/store/pdp/PdpVariantSelectors";
import { KICKS_CHROME } from "@/components/store/pdp/chrome";
import { useAddToCartFeedback } from "@/components/store/cart-feedback";
import { useCart } from "@/lib/cart-context";
import { cartLineId } from "@/lib/checkout";
import { fillFromId, swatchHex } from "@/lib/swatch";
import { sellerSlugFromPath, storefrontBase } from "@/lib/store-path";
import type { Product, StoreFaq } from "@ansaa/shared/types";

const ACCENT = KICKS_CHROME.accent;

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
  const { added, notifyAdded } = useAddToCartFeedback();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const cartHref = `${storefrontBase("sneaker-template", sellerSlugFromPath(pathname, "sneaker-template"))}/cart`;
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const features = productFeatures(product);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  function addToBag() {
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
  }

  function handleAdd() {
    addToBag();
    notifyAdded();
  }

  function handleBuy() {
    addToBag();
    router.push(cartHref);
  }

  return (
    <div>
      <div className="grid items-start gap-6 sm:grid-cols-2">
        <PdpGallery
          images={imagesForSelection(product, selectedColor, selectedSize)}
          alt={product.name}
          accent={ACCENT}
          objectFit="contain"
          aspectClass="aspect-square"
          frameClass="overflow-hidden rounded-2xl bg-[#E8E2D9]"
          thumbClass="relative flex aspect-square w-16 shrink-0 overflow-hidden rounded-xl border border-[#3C2415]/15 bg-white"
        />
        <div>
          <h1
            className="text-[32px] font-semibold leading-tight text-[#2A1C14]"
            style={{ fontFamily: "var(--font-kicks-display), ui-serif, Georgia" }}
          >
            {product.name}
          </h1>
          <PdpComparePrice
            priceCedis={product.priceCedis}
            compareAtPriceCedis={product.compareAtPriceCedis}
            wrapClassName="mt-1 flex flex-wrap items-baseline gap-2"
            priceClassName="text-xl font-bold text-[#2A1C14]"
            compareClassName="text-sm font-semibold text-[#2A1C14]/40 line-through"
          />
          <PdpShortDescription
            text={product.shortDescription}
            className="mt-3 text-sm text-[#2A1C14]/60"
          />
          {product.description ? (
            <p className="mt-4 text-sm text-[#2A1C14]/70">{product.description}</p>
          ) : null}

          <PdpFeaturesList
            features={features}
            accent={ACCENT}
            listClassName="mt-4 space-y-2"
            itemClassName="flex items-start gap-2 text-sm text-[#2A1C14]/80"
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
                ? "rounded-full bg-[#3C2415] px-4 py-1.5 text-sm font-semibold text-white"
                : "rounded-full border border-[#3C2415]/20 bg-white px-4 py-1.5 text-sm font-medium"
            }
            colorMode="chip"
            colorWrapClassName="mt-2 flex flex-wrap gap-2"
            colorChipClassName={(selected) =>
              selected
                ? "rounded-full bg-[#3C2415] px-4 py-1.5 text-sm font-semibold text-white"
                : "rounded-full border border-[#3C2415]/20 bg-white px-4 py-1.5 text-sm font-medium"
            }
          />

          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-wide">Quantity</p>
            <PdpQuantity
              value={quantity}
              onChange={setQuantity}
              wrapClass="mt-2 inline-flex h-12 items-center rounded-full border border-[#3C2415]/20 bg-white"
            />
          </div>

          <p className="mt-4 text-xs font-semibold text-[#2A1C14]/50">
            {product.stockQuantity} left
          </p>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-full border border-[#3C2415]/25 bg-[#F5F0EA] py-3 text-sm font-semibold text-[#2A1C14] transition hover:bg-white"
            >
              {added ? "Added" : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={handleBuy}
              className="flex-1 rounded-full bg-[#3C2415] py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Buy now
            </button>
          </div>
          <p className="mt-3 text-xs text-[#2A1C14]/40">Packed and dispatched with care</p>
        </div>
      </div>

      {children}
      <PdpReviews productId={product.id} chrome={KICKS_CHROME} />
      <PdpFaqs faqs={faqs} chrome={KICKS_CHROME} />
    </div>
  );
}
