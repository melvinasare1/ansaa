import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import type { Product } from "@ansaa/shared/types";
import {
  getActiveProductsForSeller,
  getSellerByStoreSlug,
  getStorefrontProduct,
} from "@/lib/storefront";

export function rideLiveStoreSlug(): string {
  return process.env.NEXT_PUBLIC_STORE_SLUG?.trim() ?? "";
}

export function isLiveRideCatalog(): boolean {
  return Boolean(rideLiveStoreSlug());
}

async function liveSeller() {
  const slug = rideLiveStoreSlug();
  if (!slug || !isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const seller = await getSellerByStoreSlug(supabase, slug);
  if (!seller) return null;
  return { supabase, seller };
}

export async function listLiveRideProducts(): Promise<Product[]> {
  const ctx = await liveSeller();
  if (!ctx) return [];
  return getActiveProductsForSeller(ctx.supabase, ctx.seller.id);
}

export async function getLiveRideProduct(productId: string): Promise<Product | null> {
  const ctx = await liveSeller();
  if (!ctx) return null;
  return getStorefrontProduct(ctx.supabase, productId, ctx.seller.id);
}
