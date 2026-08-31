/** Apex host for Ansaa-owned seller storefronts. */
export const STOREFRONT_ROOT_DOMAIN = "ansaagh.com";

/**
 * Subdomains that must never be claimed as a seller store_slug.
 * Keep in sync with sellers_store_slug_not_reserved in supabase migrations.
 */
export const RESERVED_STORE_SUBDOMAINS = [
  "www",
  "api",
  "dashboard",
  "app",
  "admin",
  "mail",
  "status",
  "cdn",
  "auth",
  "login",
  "signup",
  "staging",
  "preview",
] as const;

const RESERVED_STORE_SUBDOMAIN_SET = new Set<string>(RESERVED_STORE_SUBDOMAINS);

export function isReservedStoreSubdomain(value: string): boolean {
  return RESERVED_STORE_SUBDOMAIN_SET.has(value.trim().toLowerCase());
}

/** Host buyers use: `{store_slug}.ansaagh.com`. */
export function storefrontHost(storeSlug: string): string {
  return `${storeSlug}.${STOREFRONT_ROOT_DOMAIN}`;
}

/** Public HTTPS storefront URL. */
export function publicStorefrontUrl(storeSlug: string): string {
  return `https://${storefrontHost(storeSlug)}`;
}

export const SELLER_DOMAIN_TYPES = ["subdomain", "custom"] as const;

export type SellerDomainType = (typeof SELLER_DOMAIN_TYPES)[number];

export function parseSellerDomainType(value: unknown): SellerDomainType {
  return value === "custom" ? "custom" : "subdomain";
}
