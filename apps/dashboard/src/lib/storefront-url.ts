import { getWebUrl } from "@ansaa/shared/supabase/env";
import type { Seller } from "@ansaa/shared/types";

/** Public template preview URL for a seller, or null if no template is set. */
export function storefrontUrl(seller: Seller | null): string | null {
  if (!seller?.template) return null;
  const origin =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : getWebUrl();
  return `${origin}/store/${seller.template}`;
}
