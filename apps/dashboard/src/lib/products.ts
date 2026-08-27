import type { SupabaseClient } from "@supabase/supabase-js";
import { productFromRow } from "@ansaa/shared/mappers";
import type { Product } from "@ansaa/shared/types";

export async function getProductsForSeller(
  supabase: SupabaseClient,
  sellerId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(productFromRow);
}
