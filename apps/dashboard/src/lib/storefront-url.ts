import { publicStorefrontUrl } from "@ansaa/shared/store-domain";
import type { Seller } from "@ansaa/shared/types";

/** Public live-store URL for a seller, or null if slug is missing. */
export function storefrontUrl(seller: Seller | null): string | null {
  if (!seller?.storeSlug) return null;
  return publicStorefrontUrl(seller.storeSlug);
}

/** Internal path-based storefront URL (previews and local /store routing). */
export function storefrontPathUrl(seller: Seller | null): string | null {
  if (!seller?.template || !seller.storeSlug) return null;
  return `/store/${seller.template}/${seller.storeSlug}`;
}
