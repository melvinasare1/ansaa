"use client";

import { useCallback, useMemo, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatCedis } from "@/lib/price";
import type { CatalogSearchProduct } from "@/components/store/catalog-search-types";
import {
  applyCatalogFilters,
  filtersFromSearchParams,
  parseSearchSort,
  setRepeatParam,
  toggleNamedValue,
} from "@/components/store/catalog-search-filters";

export type { CatalogSearchProduct };

export type CatalogSearchTheme = "styleco" | "market" | "stylehive";

const THEMES: Record<
  CatalogSearchTheme,
  {
    page: string;
    heading: string;
    headingStyle?: CSSProperties;
    muted: string;
    chip: string;
    chipOn: string;
    select: string;
    card: string;
    image: string;
    title: string;
    empty: string;
  }
> = {
  styleco: {
    page: "mx-auto max-w-[1400px] px-5 py-10 md:px-8",
    heading: "text-[28px] font-extrabold tracking-tight md:text-[36px]",
    muted: "text-sm text-black/55",
    chip: "rounded-full border border-black/10 px-3.5 py-1.5 text-[12px] font-medium",
    chipOn: "rounded-full bg-black px-3.5 py-1.5 text-[12px] font-medium text-white",
    select: "rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none",
    card: "group",
    image: "relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-[#EDEDED]",
    title: "mt-3 text-[15px] font-bold leading-snug",
    empty: "mt-8 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center",
  },
  market: {
    page: "mx-auto max-w-6xl",
    heading: "font-[family-name:var(--font-market)] text-2xl font-extrabold uppercase",
    muted: "text-sm text-[#0B1220]/55",
    chip: "border-2 border-[#0B1220] px-3 py-1 text-[12px] font-semibold uppercase",
    chipOn: "border-2 border-[#1447E6] bg-[#1447E6] px-3 py-1 text-[12px] font-semibold uppercase text-white",
    select: "border-2 border-[#0B1220] bg-white px-3 py-2 text-sm font-semibold outline-none",
    card: "border-2 border-[#0B1220] p-3 transition hover:bg-[#0B1220]/5",
    image: "relative aspect-square w-full overflow-hidden bg-[#0B1220]/10",
    title: "mt-2 text-sm font-semibold leading-tight",
    empty: "mt-6 border-2 border-dashed border-[#0B1220] px-5 py-16 text-center",
  },
  stylehive: {
    page: "mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-14",
    heading: "text-[28px] font-extrabold tracking-tight text-black md:text-[34px]",
    headingStyle: { fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" },
    muted: "text-sm text-black/45",
    chip: "rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
    chipOn: "rounded-full bg-black px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-white",
    select: "rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none",
    card: "overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
    image: "relative block aspect-[4/5] bg-[#F7F7F5]",
    title: "px-4 pt-4 text-[15px] font-bold text-black",
    empty: "mt-8 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center",
  },
};

function uniqueCategories(products: CatalogSearchProduct[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const product of products) {
    const name = product.category.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function CatalogSearch({
  products,
  productBase,
  theme,
}: {
  products: CatalogSearchProduct[];
  productBase: string;
  theme: CatalogSearchTheme;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const styles = THEMES[theme];
  const filters = filtersFromSearchParams(searchParams);
  const categories = useMemo(() => uniqueCategories(products), [products]);

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleCategory = (value: string) => {
    replaceParams((params) => {
      setRepeatParam(params, "category", toggleNamedValue(filters.categories, value));
    });
  };

  const results = useMemo(() => applyCatalogFilters(products, filters), [filters, products]);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading} style={styles.headingStyle}>
        Search
      </h1>
      <p className={`mt-2 ${styles.muted}`}>Browse this shop’s products.</p>

      {categories.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = filters.categories.some(
              (item) => item.toLowerCase() === category.toLowerCase()
            );
            return (
              <button
                key={category}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleCategory(category)}
                className={selected ? styles.chipOn : styles.chip}
              >
                {category}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className={styles.muted}>
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
        <label className={`flex items-center gap-2 ${styles.muted}`}>
          Sort
          <select
                value={filters.sort}
                onChange={(event) => {
                  const next = parseSearchSort(event.target.value);
              replaceParams((params) => {
                if (next === "newest") params.delete("sort");
                else params.set("sort", next);
              });
            }}
            className={styles.select}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.heading} style={styles.headingStyle}>
            No products listed yet
          </p>
          <p className={`mt-2 ${styles.muted}`}>Active products from this shop will show up here.</p>
        </div>
      ) : results.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.heading} style={styles.headingStyle}>
            No products match your filters
          </p>
          <p className={`mt-2 ${styles.muted}`}>Try another keyword or clear a category.</p>
        </div>
      ) : (
        <div
          className={
            theme === "market"
              ? "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
              : "mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {results.map((product) => (
            <article key={product.id} className={styles.card}>
              <Link href={`${productBase}/product/${product.id}`} className={styles.image}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                ) : null}
              </Link>
              <Link href={`${productBase}/product/${product.id}`}>
                <p className={styles.title} style={theme === "stylehive" ? styles.headingStyle : undefined}>
                  {product.name}
                </p>
                <p
                  className={
                    theme === "stylehive"
                      ? "px-4 pb-4 pt-1 text-[14px] text-black/80"
                      : theme === "market"
                        ? "mt-1 font-[family-name:var(--font-market)] font-extrabold"
                        : "mt-1 text-[14px] text-black/80"
                  }
                >
                  {formatCedis(product.priceCedis)}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function CatalogSearchSkeleton({ theme }: { theme: CatalogSearchTheme }) {
  const styles = THEMES[theme];
  return (
    <div className={styles.page}>
      <div className="h-10 w-40 animate-pulse rounded bg-black/10" />
      <div
        className={
          theme === "market"
            ? "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
            : "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-black/10" />
        ))}
      </div>
    </div>
  );
}
