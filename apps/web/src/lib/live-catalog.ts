import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import type { Product, StoreFaq } from "@ansaa/shared/types";
import {
  getActiveProductsForSeller,
  getSellerByStoreSlug,
  getStorefrontProduct,
} from "@/lib/storefront";

export function liveStoreSlug(): string {
  return process.env.NEXT_PUBLIC_STORE_SLUG?.trim() ?? "";
}

export function isLiveStorefrontCatalog(): boolean {
  return Boolean(liveStoreSlug());
}

async function liveSeller() {
  const slug = liveStoreSlug();
  if (!slug || !isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const seller = await getSellerByStoreSlug(supabase, slug);
  if (!seller) return null;
  return { supabase, seller };
}

export async function listLiveProducts(): Promise<Product[]> {
  const ctx = await liveSeller();
  if (!ctx) return [];
  return getActiveProductsForSeller(ctx.supabase, ctx.seller.id);
}

export async function getLiveProduct(productId: string): Promise<Product | null> {
  const ctx = await liveSeller();
  if (!ctx) return null;
  return getStorefrontProduct(ctx.supabase, productId, ctx.seller.id);
}

export async function getLiveSellerFaqs(): Promise<StoreFaq[]> {
  const ctx = await liveSeller();
  return ctx?.seller.faqs ?? [];
}

export type RideFilterFacets = {
  tags: string[];
  engineSizes: string[];
  colours: string[];
  years: number[];
};

function uniqueSortedNames(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const name = raw.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function uniqueSortedYears(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => b - a);
}

export async function getLiveRideFilterFacets(): Promise<RideFilterFacets> {
  const ctx = await liveSeller();
  if (!ctx) return { tags: [], engineSizes: [], colours: [], years: [] };

  const { data, error } = await ctx.supabase
    .from("product_filter_options")
    .select("kind, name")
    .eq("seller_id", ctx.seller.id);

  if (error || !data?.length) return { tags: [], engineSizes: [], colours: [], years: [] };

  const tags: string[] = [];
  const engineSizes: string[] = [];
  const colours: string[] = [];
  const years: number[] = [];
  for (const row of data) {
    const name = String(row.name ?? "").trim();
    if (!name) continue;
    if (row.kind === "tag") tags.push(name);
    if (row.kind === "engine_size") engineSizes.push(name);
    if (row.kind === "colour") colours.push(name);
    if (row.kind === "year") {
      const year = Number(name);
      if (Number.isInteger(year)) years.push(year);
    }
  }

  return {
    tags: uniqueSortedNames(tags),
    engineSizes: uniqueSortedNames(engineSizes),
    colours: uniqueSortedNames(colours),
    years: uniqueSortedYears(years),
  };
}
