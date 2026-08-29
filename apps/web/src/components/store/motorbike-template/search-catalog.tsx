"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RideProductCard } from "@/components/store/motorbike-template/product-card";
import {
  VEHICLE_CATEGORIES,
  parsePriceBound,
  parseSearchSort,
  parseVehicleCategoryParam,
  productMatchesVehicleCategory,
  type SearchSort,
  type VehicleCategorySlug,
} from "@/components/store/motorbike-template/vehicle-categories";

const ORANGE = "#E8622C";

export type RideSearchProduct = {
  id: string;
  name: string;
  priceCedis: number;
  category: string;
  createdAt: number;
  image: string;
  colors: string[];
};

const SORT_OPTIONS: Array<{ value: SearchSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function RideSearchCatalog({
  products,
  productBase,
}: {
  products: RideSearchProduct[];
  productBase: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategories = parseVehicleCategoryParam(searchParams.getAll("category"));
  const sort = parseSearchSort(searchParams.get("sort") ?? undefined);
  const urlMin = searchParams.get("min") ?? "";
  const urlMax = searchParams.get("max") ?? "";
  const [minDraft, setMinDraft] = useState(urlMin);
  const [maxDraft, setMaxDraft] = useState(urlMax);

  useEffect(() => {
    setMinDraft(urlMin);
  }, [urlMin]);

  useEffect(() => {
    setMaxDraft(urlMax);
  }, [urlMax]);

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleCategory = (slug: VehicleCategorySlug) => {
    replaceParams((params) => {
      const next = parseVehicleCategoryParam(params.getAll("category"));
      const updated = next.includes(slug)
        ? next.filter((item) => item !== slug)
        : [...next, slug];
      params.delete("category");
      for (const item of updated) params.append("category", item);
    });
  };

  const commitPrice = () => {
    replaceParams((params) => {
      const min = parsePriceBound(minDraft);
      const max = parsePriceBound(maxDraft);
      if (min == null) params.delete("min");
      else params.set("min", String(Math.round(min)));
      if (max == null) params.delete("max");
      else params.set("max", String(Math.round(max)));
    });
  };

  const setSort = (next: SearchSort) => {
    replaceParams((params) => {
      if (next === "newest") params.delete("sort");
      else params.set("sort", next);
    });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
    setMinDraft("");
    setMaxDraft("");
  };

  const minPrice = parsePriceBound(urlMin);
  const maxPrice = parsePriceBound(urlMax);
  const hasFilters =
    selectedCategories.length > 0 || minPrice != null || maxPrice != null || sort !== "newest";

  const results = useMemo(() => {
    const filtered = products.filter((product) => {
      if (selectedCategories.length > 0) {
        const matches = selectedCategories.some((slug) =>
          productMatchesVehicleCategory(product.category, slug)
        );
        if (!matches) return false;
      }
      if (minPrice != null && product.priceCedis < minPrice) return false;
      if (maxPrice != null && product.priceCedis > maxPrice) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.priceCedis - b.priceCedis;
      if (sort === "price-desc") return b.priceCedis - a.priceCedis;
      return b.createdAt - a.createdAt;
    });
  }, [maxPrice, minPrice, products, selectedCategories, sort]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-[36px] font-extrabold tracking-tight text-[#141414] md:text-[44px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Search
          </h1>
          <p className="mt-2 text-sm text-[#141414]/55">
            Browse motorbikes, bicycles, mopeds, and scooters.
          </p>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start text-sm font-semibold text-[#141414]/60 underline-offset-4 hover:text-[#141414] hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <aside className="rounded-[24px] border border-[#D9D6CE] bg-[#FFFDFA] p-6">
          <p
            className="text-[15px] font-extrabold text-[#141414]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Filter
          </p>

          <fieldset className="mt-6">
            <legend className="text-[13px] font-semibold text-[#141414]">Category</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {VEHICLE_CATEGORIES.map((category) => {
                const selected = selectedCategories.includes(category.slug);
                return (
                  <button
                    key={category.slug}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCategory(category.slug)}
                    className="rounded-full border px-3.5 py-1.5 text-[12px] font-semibold tracking-wide"
                    style={
                      selected
                        ? { backgroundColor: ORANGE, borderColor: ORANGE, color: "#FFFFFF" }
                        : { borderColor: "#141414", color: "#141414", backgroundColor: "transparent" }
                    }
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[13px] font-semibold text-[#141414]">Price (GHS)</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-[12px] text-[#141414]/55">
                Min
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minDraft}
                  onChange={(event) => setMinDraft(event.target.value)}
                  onBlur={commitPrice}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    }
                  }}
                  placeholder="0"
                  className="mt-1.5 w-full rounded-lg border border-[#D9D6CE] bg-white px-3 py-2 text-sm text-[#141414] outline-none focus:border-[#141414]"
                />
              </label>
              <label className="block text-[12px] text-[#141414]/55">
                Max
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxDraft}
                  onChange={(event) => setMaxDraft(event.target.value)}
                  onBlur={commitPrice}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    }
                  }}
                  placeholder="Any"
                  className="mt-1.5 w-full rounded-lg border border-[#D9D6CE] bg-white px-3 py-2 text-sm text-[#141414] outline-none focus:border-[#141414]"
                />
              </label>
            </div>
          </fieldset>
        </aside>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#141414]/55">
              {results.length} {results.length === 1 ? "vehicle" : "vehicles"}
            </p>
            <label className="flex items-center gap-2 text-sm text-[#141414]">
              <span className="text-[#141414]/55">Sort</span>
              <select
                value={sort}
                onChange={(event) => {
                  const next = event.target.value;
                  if (next === "newest" || next === "price-asc" || next === "price-desc") {
                    setSort(next);
                  }
                }}
                className="rounded-lg border border-[#D9D6CE] bg-white px-3 py-2 text-sm outline-none focus:border-[#141414]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {products.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-[#D9D6CE] px-6 py-16 text-center">
              <p
                className="text-[22px] font-extrabold text-[#141414]"
                style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
              >
                No vehicles listed yet
              </p>
              <p className="mt-2 text-sm text-[#141414]/55">
                Active products from this shop will show up here.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-[#D9D6CE] px-6 py-16 text-center">
              <p
                className="text-[22px] font-extrabold text-[#141414]"
                style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
              >
                No vehicles match your filters
              </p>
              <p className="mt-2 text-sm text-[#141414]/55">
                Try another category or widen the price range.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: ORANGE }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product) => (
                <RideProductCard
                  key={product.id}
                  href={`${productBase}/product/${product.id}`}
                  productId={product.id}
                  name={product.name}
                  priceCedis={product.priceCedis}
                  image={product.image}
                  colors={product.colors}
                  titleAs="h2"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function RideSearchSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-14">
      <div className="h-10 w-40 animate-pulse rounded bg-[#E8E6E1]" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="h-72 animate-pulse rounded-[24px] bg-[#E8E6E1]" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded-[24px] bg-[#E8E6E1]" />
          ))}
        </div>
      </div>
    </div>
  );
}
