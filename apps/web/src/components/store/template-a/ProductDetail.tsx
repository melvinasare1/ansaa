"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Minus, Plus } from "lucide-react";
import { ShirtPlaceholder } from "@/components/store/template-a/ShirtPlaceholder";
import { ProductFaqs } from "@/components/store/template-a/ProductFaqs";
import { ProductReviews } from "@/components/store/template-a/ProductReviews";
import { useCart } from "@/lib/cart-context";
import { formatCedis } from "@/lib/price";
import { fillFromId, isLightSwatch, swatchHex } from "@/lib/swatch";
import type { Product, StoreFaq } from "@ansaa/shared/types";

const ACCENT = "#FF7A1A";

type GalleryItem =
  | { kind: "image"; src: string }
  | { kind: "swatch"; fill: string };

function uniqueUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const src of urls) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    result.push(src);
  }
  return result;
}

function imagesForValue(product: Product, value: string): string[] {
  const key = value.trim().toLowerCase();
  if (!key) return [];
  for (const variant of product.variants ?? []) {
    const byValue = variant.imagesByValue;
    if (byValue) {
      for (const [label, list] of Object.entries(byValue)) {
        if (label.toLowerCase() === key && list.length) return uniqueUrls(list);
      }
    }
    const variantColor = (variant.color ?? "").trim().toLowerCase();
    const variantSize = (variant.size ?? "").trim().toLowerCase();
    if ((variantColor === key || variantSize === key) && variant.images.length) {
      return uniqueUrls(variant.images);
    }
  }
  return [];
}

function imagesForVariant(product: Product, color: string, size: string): string[] {
  const colorImages = imagesForValue(product, color);
  if (colorImages.length > 0) return colorImages;
  const sizeImages = imagesForValue(product, size);
  if (sizeImages.length > 0) return sizeImages;
  return product.images;
}

function galleryFor(product: Product, color: string, size: string): GalleryItem[] {
  const urls = imagesForVariant(product, color, size);
  if (urls.length > 0) {
    return urls.map((src) => ({ kind: "image" as const, src }));
  }
  if (product.colors && product.colors.length > 0) {
    return product.colors.slice(0, 4).map((item) => ({
      kind: "swatch" as const,
      fill: swatchHex(item),
    }));
  }
  return [{ kind: "swatch", fill: fillFromId(product.id) }];
}

function cartLineId(productId: string, size?: string, color?: string) {
  if (!size && !color) return productId;
  return `${productId}:${size ?? ""}:${color ?? ""}`;
}

function GalleryThumbs({
  gallery,
  selectedImage,
  onSelect,
  className,
}: {
  gallery: GalleryItem[];
  selectedImage: number;
  onSelect: (index: number) => void;
  className: string;
}) {
  return (
    <div className={className}>
      {gallery.map((item, index) => {
        const selected = index === selectedImage;
        return (
          <button
            key={item.kind === "image" ? item.src : `${item.fill}-${index}`}
            type="button"
            aria-label={`View image ${index + 1}`}
            aria-pressed={selected}
            onClick={() => onSelect(index)}
            className="relative flex aspect-square w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EDEDED] md:w-20"
            style={{
              boxShadow: selected ? `inset 0 0 0 2px ${ACCENT}` : undefined,
            }}
          >
            {item.kind === "image" ? (
              <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <ShirtPlaceholder fill={item.fill} className="h-[72%] w-[72%]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

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
  const cartHref = "/store/template-a/cart";
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const features = (product.features ?? []).map((item) => item.trim()).filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  const gallery = useMemo(
    () => galleryFor(product, selectedColor, selectedSize),
    [product, selectedColor, selectedSize]
  );
  const galleryKey = gallery
    .map((item) => (item.kind === "image" ? item.src : item.fill))
    .join("|");

  useEffect(() => {
    setSelectedImage(0);
  }, [galleryKey]);

  const main = gallery[Math.min(selectedImage, Math.max(gallery.length - 1, 0))] ?? gallery[0];

  function handleBuy() {
    const size = selectedSize || undefined;
    const color = selectedColor || undefined;
    const variantLabel = [size, color].filter(Boolean).join(" / ");
    const qty = Math.min(99, Math.max(1, Math.floor(quantity) || 1));
    const cartImage =
      main?.kind === "image"
        ? main.src
        : color
          ? swatchHex(color)
          : fillFromId(product.id);

    addItem({
      productId: cartLineId(product.id, size, color),
      name: variantLabel ? `${product.name} · ${variantLabel}` : product.name,
      priceCedis: product.priceCedis,
      image: cartImage,
      size,
      color,
      quantity: qty,
    });
    router.push(cartHref);
  }

  return (
    <div>
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-4 lg:flex-row">
        {gallery.length > 1 ? (
          <GalleryThumbs
            gallery={gallery}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
            className="hidden max-h-[560px] shrink-0 flex-col gap-3 overflow-y-auto pr-1 lg:flex"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="relative flex aspect-[3/4] max-h-[560px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#EDEDED]">
            {main?.kind === "image" ? (
              <Image
                src={main.src}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
                priority
              />
            ) : (
              <ShirtPlaceholder
                fill={main?.kind === "swatch" ? main.fill : fillFromId(product.id)}
                className="h-[72%] w-[72%]"
              />
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 flex items-center gap-3 lg:hidden">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => setSelectedImage((current) => (current - 1 + gallery.length) % gallery.length)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <GalleryThumbs
                gallery={gallery}
                selectedImage={selectedImage}
                onSelect={setSelectedImage}
                className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-1"
              />
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setSelectedImage((current) => (current + 1) % gallery.length)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="lg:pt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight md:text-[32px]">
          {product.name}
        </h1>
        {product.description ? (
          <p className="mt-3 text-[14px] leading-relaxed text-black/45">{product.description}</p>
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

        <p className="mt-5 text-[36px] font-extrabold leading-none" style={{ color: ACCENT }}>
          {formatCedis(product.priceCedis)}
        </p>

        {sizes.length > 0 ? (
          <div className="mt-8">
            <p className="text-[15px] font-bold">Select Size</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
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
                          ? "h-10 min-w-[44px] rounded-lg px-3.5 text-sm font-semibold text-white"
                          : "h-10 min-w-[44px] rounded-lg border border-black/15 bg-white px-3.5 text-sm font-medium text-black"
                      }
                      style={selected ? { backgroundColor: ACCENT } : undefined}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <a href="#" className="shrink-0 text-[13px] font-medium text-black/55 underline underline-offset-2">
                Size Guide
              </a>
            </div>
          </div>
        ) : null}

        {colors.length > 0 ? (
          <div className="mt-7">
            <p className="text-[15px] font-bold">Colors Available</p>
            <div className="mt-3 flex items-center gap-3">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={selected ? { boxShadow: "0 0 0 1.5px #111" } : undefined}
                  >
                    <span
                      className="h-7 w-7 rounded-full"
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

        <div className="mt-8">
          <p className="text-[15px] font-bold">Quantity</p>
          <div className="mt-3 inline-flex h-12 items-center rounded-full border border-black/15 bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="flex h-12 w-12 items-center justify-center text-black/70 hover:text-black"
            >
              <Minus className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="min-w-[2ch] text-center text-[15px] font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((current) => Math.min(99, current + 1))}
              className="flex h-12 w-12 items-center justify-center text-black/70 hover:text-black"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBuy}
          className="mt-10 flex h-12 w-full items-center justify-center rounded-full bg-black text-[15px] font-semibold text-white transition hover:bg-black/90"
        >
          Buy this product
        </button>
      </div>
      </div>

      {children}
      <ProductReviews productId={product.id} />
      <ProductFaqs faqs={faqs} />
    </div>
  );
}
