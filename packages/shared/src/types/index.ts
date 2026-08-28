// Postgres data model (see supabase/migrations/). TypeScript stays camelCase;
// snake_case columns are mapped at the query layer in mappers.ts.
// Everything tenant-scoped is keyed by sellerId (= sellers.id). Once Auth is
// wired, create seller rows with id = auth.uid().

/**
 * Product pricing: Website & Admin vs Fulfilment.
 * Postgres `sellers.pricing_tier` still checks `early_bird | standard`
 * (schema unchanged); mappers translate at the query layer.
 */
export type PricingTier = "website_admin" | "fulfilment";

export const PRICING_TIER_BASE_FEE_CEDIS: Record<PricingTier, number> = {
  website_admin: 250,
  fulfilment: 400,
};

export type SellerUser = {
  uid: string;
  email: string | null;
};

export const STOREFRONT_TEMPLATES = [
  "template-a",
  "template-b",
  "template-c",
  "template-d",
  "template-e",
] as const;

export type StorefrontTemplate = (typeof STOREFRONT_TEMPLATES)[number];

export function parseStorefrontTemplate(value: unknown): StorefrontTemplate {
  return STOREFRONT_TEMPLATES.includes(value as StorefrontTemplate)
    ? (value as StorefrontTemplate)
    : "template-a";
}

export interface Seller {
  id: string;
  uid: string; // Intended auth uid of the seller who owns this tenant
  businessName: string;
  domain: string; // e.g. "makeup.com" — storefront lives here, dashboard at dashboard.makeup.com
  storeSlug: string; // fallback path-based routing in dev: /store/[slug]
  template: StorefrontTemplate;
  email: string;
  phone: string;
  pricingTier: PricingTier;
  baseFeeCedis: number; // 250 Website & Admin, 400 Fulfilment intro
  status: "onboarding" | "active" | "paused" | "offboarded";
  createdAt: number;
  /** Private storage object path in the id-verification bucket, not a public URL. */
  idDocumentUrl?: string;
  profilePhotoUrl?: string;
  businessRegistrationUrl?: string;
  hasBusinessRegistration: boolean;
}

export type ProductVariant = {
  id: string;
  name?: string;
  values?: string[];
  size?: string;
  color?: string;
  sku: string;
  priceCedis: number;
  stockQuantity: number;
  images: string[];
  imagesByValue?: Record<string, string[]>;
};

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  shortDescription?: string;
  priceCedis: number;
  compareAtPriceCedis?: number;
  images: string[];
  stockQuantity: number;
  sku: string;
  category: string;
  active: boolean;
  createdAt: number;
  // Optional variant options the seller sets on the product. Buyer selections
  // live on the cart item, not on this row.
  sizes?: string[];
  colors?: string[];
  /** Named options the seller adds (e.g. Color with values Black, White). */
  variants?: ProductVariant[];
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "packed"
  | "dispatched"
  | "delivered"
  | "return_requested"
  | "returned"
  | "cancelled"
  | "refunded";

export interface Customer {
  id: string;
  sellerId: string;
  email: string;
  name: string;
  phone: string;
  deliveryAddress: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  priceCedis: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  sellerId: string;
  customerId?: string;
  items: OrderItem[];
  subtotalCedis: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  paymentReference?: string;
  packagingPhotoUrl?: string;
  packagingVideoUrl?: string;
  riderService?: "yango" | "in_house";
  createdAt: number;
  packedAt?: number;
  dispatchedAt?: number;
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  sellerId: string;
  impressions: number;
  storeVisits: number;
  ordersPlaced: number;
  revenueCedis: number;
}

export type StorefrontEventType = "page_view" | "product_view" | "add_to_cart";

export interface StorefrontEvent {
  id: string;
  sellerId: string;
  eventType: StorefrontEventType;
  path: string;
  productId?: string;
  sessionId: string;
  createdAt: number;
}

// Signup lead from the landing page — not yet a seller until onboarded/inspected
export interface SignupLead {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  productCategory: string;
  estimatedMonthlyOrders?: number;
  notes?: string;
  createdAt: number;
}
