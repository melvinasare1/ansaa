import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronUp, Heart, SlidersHorizontal } from "lucide-react";
import { AddToBagButton } from "@/components/store/template-a/AddToBagButton";
import { ShirtPlaceholder } from "@/components/store/template-a/ShirtPlaceholder";
import { formatCedis } from "@/lib/price";
import { getActiveProductsForSeller, getSellerByStoreSlug } from "@/lib/storefront";
import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import { fillFromId, swatchHex } from "@/lib/swatch";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import type { Product } from "@ansaa/shared/types";
import { storefrontContentValue } from "@ansaa/shared/storefront-content-schema";

const ACCENT = "#FF7A1A";

const FALLBACK_HERO_HEADLINE = "Men's Clothing";
const FALLBACK_HERO_SUBTEXT = "New season pieces, made to last.";
const FALLBACK_ABOUT =
  "Quality clothing made for everyday wear. New drops and classics, all in one shop.";

const categories = [
  "Dresses",
  "Denim & Jeans",
  "Knitwear",
  "Skirts",
  "Pants",
  "Jackets & Coats",
  "Tops & Tees",
];

const filterColors = [
  { name: "Green", hex: "#2F9E44" },
  { name: "Black", hex: "#111111" },
  { name: "Purple", hex: "#7B2CBF" },
  { name: "Red", hex: "#E03131" },
  { name: "Blue", hex: "#1C7ED6" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Brown", hex: "#C08A4D" },
  { name: "Pink", hex: "#F783AC" },
  { name: "Yellow", hex: "#F4C430" },
  { name: "Sky", hex: "#74C0FC" },
  { name: "Gray", hex: "#ADB5BD" },
  { name: "Crimson", hex: "#C92A2A" },
];

function productSwatch(product: Product): string {
  const firstColor = product.colors?.[0];
  if (firstColor) return swatchHex(firstColor);
  return fillFromId(product.id);
}

function CatalogMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-black/55">{body}</p>
    </div>
  );
}

function FilterSidebar() {
  return (
    <aside className="w-full shrink-0 border-black/10 px-5 py-8 md:w-[280px] md:border-r lg:w-[300px] md:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filter</h2>
        <SlidersHorizontal className="h-4 w-4 text-black" strokeWidth={2} />
      </div>

      <ul className="mt-5 space-y-0.5">
        {categories.map((label) => (
          <li key={label}>
            <a
              href="#catalog"
              className="flex items-center justify-between py-1.5 text-[14px] text-black transition-opacity hover:opacity-60"
            >
              {label}
              <ChevronRight className="h-4 w-4 text-black/30" strokeWidth={1.75} />
            </a>
          </li>
        ))}
      </ul>

      <details open className="group mt-4 border-t border-black/10 pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
          <span className="text-[15px] font-bold">Price</span>
          <ChevronUp
            className="h-4 w-4 text-black/50 transition-transform group-open:rotate-0 rotate-180"
            strokeWidth={2}
          />
        </summary>
        <div className="mt-5">
          <div className="relative h-1.5 rounded-full bg-[#E5E5E5]" aria-hidden>
            <div
              className="absolute inset-y-0 rounded-full"
              style={{ left: "8%", right: "18%", backgroundColor: ACCENT }}
            />
            <span
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
              style={{ left: "8%", backgroundColor: ACCENT }}
            />
            <span
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
              style={{ left: "82%", backgroundColor: ACCENT }}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              readOnly
              value="$100"
              aria-label="Minimum price"
              className="h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-center text-sm text-black/70 outline-none"
            />
            <input
              type="text"
              readOnly
              value="$2000"
              aria-label="Maximum price"
              className="h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-center text-sm text-black/70 outline-none"
            />
          </div>
        </div>
      </details>

      <details open className="group mt-5 border-t border-black/10 pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
          <span className="text-[15px] font-bold">Colors</span>
          <ChevronUp
            className="h-4 w-4 text-black/50 transition-transform group-open:rotate-0 rotate-180"
            strokeWidth={2}
          />
        </summary>
        <ul className="mt-4 grid grid-cols-4 gap-x-3 gap-y-3.5">
          {filterColors.map((color) => (
            <li key={color.name} className="flex flex-col items-center gap-1.5">
              <span
                className="h-8 w-8 rounded-md"
                style={{
                  backgroundColor: color.hex,
                  boxShadow: color.hex === "#FFFFFF" ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : undefined,
                }}
              />
              <span className="text-[11px] text-black/55">{color.name}</span>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}

export default async function TemplateAHome({ params }: { params: { slug: string } }) {
  const base = `/store/template-a/${params.slug}`;

  if (!isSupabaseConfigured()) {
    return (
      <CatalogMessage
        title="Store not found"
        body="This storefront isn't connected yet. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      />
    );
  }

  const supabase = await createClient();
  const seller = await getSellerByStoreSlug(supabase, params.slug);
  if (!seller) {
    notFound();
  }

  const products = await getActiveProductsForSeller(supabase, seller.id);
  const content = seller.storeContent;
  const heroHeadline = storefrontContentValue(content, "heroHeadline", FALLBACK_HERO_HEADLINE);
  const heroSubtext = storefrontContentValue(content, "heroSubtext", FALLBACK_HERO_SUBTEXT);
  const heroImageUrl = storefrontContentValue(content, "heroImageUrl");
  const aboutText = storefrontContentValue(content, "aboutText", FALLBACK_ABOUT);

  return (
    <div>
      <StorefrontTracker storeSlug={params.slug} path={base} />

      <section className="overflow-hidden bg-[#F4F1EC]">
        {heroImageUrl ? (
          <div className="relative min-h-[240px] w-full aspect-[16/7]">
            <Image
              src={heroImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col justify-end px-5 py-10 md:px-8 lg:px-10">
              <h1 className="text-[28px] font-extrabold tracking-tight text-white md:text-[40px]">
                {heroHeadline}
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-white/85">{heroSubtext}</p>
            </div>
          </div>
        ) : (
          <div className="px-5 py-12 md:px-8 md:py-16 lg:px-10">
            <h1 className="text-[28px] font-extrabold tracking-tight md:text-[40px]">
              {heroHeadline}
            </h1>
            <p className="mt-2 max-w-xl text-[15px] text-black/55">{heroSubtext}</p>
          </div>
        )}
      </section>

      <div
        id="catalog"
        className="mx-auto flex max-w-[1400px] flex-col md:flex-row md:items-start"
      >
        <FilterSidebar />

        <section className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
              <p className="text-lg font-bold">No products yet</p>
              <p className="mt-2 text-sm text-black/50">
                This seller hasn't listed any active products.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const photo = product.images[0];
                const swatch = productSwatch(product);
                return (
                  <article key={product.id} className="group">
                    <div className="relative">
                      <Link
                        href={`${base}/product/${product.id}`}
                        className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-[#EDEDED]"
                      >
                        {photo ? (
                          <Image
                            src={photo}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                            className="object-cover"
                          />
                        ) : (
                          <ShirtPlaceholder fill={swatch} />
                        )}
                      </Link>
                      <button
                        type="button"
                        aria-label="Add to wishlist"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center"
                      >
                        <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} color="#111" />
                      </button>
                    </div>

                    <div className="relative mt-3 pr-11">
                      <Link href={`${base}/product/${product.id}`}>
                        <p className="text-[15px] font-bold leading-snug">{product.name}</p>
                        <p className="mt-1 text-[14px] text-black/80">{formatCedis(product.priceCedis)}</p>
                      </Link>
                      <AddToBagButton
                        productId={product.id}
                        name={product.name}
                        priceCedis={product.priceCedis}
                        image={swatch}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 lg:px-10">
        <h2 className="text-lg font-bold tracking-tight">About</h2>
        <p className="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-black/65">
          {aboutText}
        </p>
      </section>
    </div>
  );
}
