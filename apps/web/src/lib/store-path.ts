import type { StorefrontTemplate } from "@ansaa/shared/types";

/** Static first segments under `/store/{template}/` that are never a seller slug. */
export const STORE_RESERVED_SEGMENTS = new Set([
  "search",
  "blog",
  "product",
  "cart",
  "contact",
]);

export function storefrontBase(template: StorefrontTemplate, storeSlug?: string): string {
  return storeSlug ? `/store/${template}/${storeSlug}` : `/store/${template}`;
}

/** Seller `store_slug` from a storefront pathname, or undefined on demo/preview routes. */
export function sellerSlugFromPath(pathname: string, template: StorefrontTemplate): string | undefined {
  const prefix = `/store/${template}`;
  if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return undefined;
  const segment = pathname.slice(prefix.length).replace(/^\//, "").split("/")[0] ?? "";
  if (!segment || STORE_RESERVED_SEGMENTS.has(segment)) return undefined;
  return segment;
}
