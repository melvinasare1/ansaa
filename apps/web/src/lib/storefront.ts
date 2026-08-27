import type { SupabaseClient } from "@supabase/supabase-js";
import { productFromRow, sellerFromRow } from "@ansaa/shared/mappers";
import type { Product } from "@ansaa/shared/types";

export type StorefrontSeller = {
  id: string;
  storeSlug: string;
  businessName: string;
};

export async function getSellerByStoreSlug(
  supabase: SupabaseClient,
  slug: string
): Promise<StorefrontSeller | null> {
  if (!slug) return null;

  const { data, error } = await supabase
    .from("sellers")
    .select("id, store_slug, business_name")
    .eq("store_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load seller by slug", error);
    return null;
  }
  if (!data) return null;

  const seller = sellerFromRow(data);
  return {
    id: seller.id,
    storeSlug: seller.storeSlug,
    businessName: seller.businessName,
  };
}

export async function getActiveProductsForSeller(
  supabase: SupabaseClient,
  sellerId: string
): Promise<Product[]> {
  if (!sellerId) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load storefront products", error);
    return [];
  }

  return (data ?? []).map(productFromRow);
}

export async function getStorefrontProduct(
  supabase: SupabaseClient,
  productId: string,
  sellerId: string
): Promise<Product | null> {
  if (!productId || !sellerId) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load storefront product", error);
    return null;
  }
  if (!data) return null;

  const product = productFromRow(data);
  if (product.sellerId !== sellerId || !product.active) return null;
  return product;
}
