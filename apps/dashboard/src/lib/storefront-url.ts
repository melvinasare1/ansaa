import { getWebUrl } from "@ansaa/shared/supabase/env";
import type { Seller } from "@ansaa/shared/types";

/** Public live-store URL for a seller, or null if template or slug is missing. */
export function storefrontUrl(seller: Seller | null): string | null {
  if (!seller?.template || !seller.storeSlug) return null;
  const origin =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : getWebUrl();
  return `${origin}/store/${seller.template}/${seller.storeSlug}`;
}
