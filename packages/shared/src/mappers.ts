import type {
  Customer,
  Order,
  OrderItem,
  OrderStatus,
  PricingTier,
  Product,
  ProductVariant,
  Seller,
  SignupLead,
  StorefrontEvent,
  StorefrontEventType,
} from "./types";

const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "packed",
  "dispatched",
  "delivered",
  "return_requested",
  "returned",
  "cancelled",
  "refunded",
];

/** Postgres CHECK still allows only early_bird | standard. */
const PRICING_TIER_TO_COLUMN: Record<PricingTier, "early_bird" | "standard"> = {
  website_admin: "early_bird",
  fulfilment: "standard",
};

function pricingTierFromColumn(value: unknown): PricingTier {
  if (value === "fulfilment" || value === "standard") return "fulfilment";
  return "website_admin";
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map((entry) => String(entry).trim()).filter(Boolean);
  return items.length ? items : undefined;
}

function imagesByValueFromUnknown(value: unknown): Record<string, string[]> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out: Record<string, string[]> = {};
  for (const [key, urls] of Object.entries(value as Record<string, unknown>)) {
    if (!Array.isArray(urls)) continue;
    const list = urls.map(String).filter(Boolean);
    if (list.length) out[key] = list;
  }
  return Object.keys(out).length ? out : undefined;
}

function variantFromUnknown(value: unknown): ProductVariant | null {
  const fields = asRecord(value);
  const id = String(fields.id ?? "").trim();
  if (!id) return null;
  const images = Array.isArray(fields.images) ? fields.images.map(String).filter(Boolean) : [];
  const color = String(fields.color ?? "").trim() || undefined;
  const size = String(fields.size ?? "").trim() || undefined;
  const values =
    optionalStringArray(fields.values) ??
    [color, size].filter((item): item is string => Boolean(item));
  let imagesByValue = imagesByValueFromUnknown(fields.imagesByValue ?? fields.images_by_value);
  if (!imagesByValue && images.length && color) {
    imagesByValue = { [color]: images };
  }
  return {
    id,
    name: String(fields.name ?? "").trim() || undefined,
    values,
    size,
    color,
    sku: String(fields.sku ?? ""),
    priceCedis: Number(fields.priceCedis ?? fields.price_cedis ?? 0),
    stockQuantity: Number(fields.stockQuantity ?? fields.stock_quantity ?? 0),
    images,
    imagesByValue,
  };
}

function epochMs(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function optionalNumber(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function variantsFromUnknown(value: unknown): ProductVariant[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map(variantFromUnknown).filter((row): row is ProductVariant => Boolean(row));
  return items.length ? items : undefined;
}

/** Map a products row (snake_case) to the Product type (camelCase). */
export function productFromRow(row: unknown): Product {
  const fields = asRecord(row);
  return {
    id: String(fields.id ?? ""),
    sellerId: String(fields.seller_id ?? ""),
    name: String(fields.name ?? ""),
    description: String(fields.description ?? ""),
    shortDescription: String(fields.short_description ?? "") || undefined,
    priceCedis: Number(fields.price_cedis ?? 0),
    compareAtPriceCedis: optionalNumber(fields.compare_at_price_cedis),
    images: Array.isArray(fields.images) ? fields.images.map(String) : [],
    stockQuantity: Number(fields.stock_quantity ?? 0),
    sku: String(fields.sku ?? ""),
    category: String(fields.category ?? ""),
    active: Boolean(fields.active),
    createdAt: epochMs(fields.created_at),
    sizes: optionalStringArray(fields.sizes),
    colors: optionalStringArray(fields.colors),
    variants: variantsFromUnknown(fields.variants),
  };
}

export function sellerToInsert(seller: Omit<Seller, "createdAt"> & { createdAt?: number }) {
  return {
    id: seller.id,
    uid: seller.uid,
    business_name: seller.businessName,
    domain: seller.domain,
    store_slug: seller.storeSlug,
    template: seller.template,
    email: seller.email,
    phone: seller.phone,
    pricing_tier: PRICING_TIER_TO_COLUMN[seller.pricingTier] ?? "early_bird",
    base_fee_cedis: seller.baseFeeCedis,
    status: seller.status,
    created_at: new Date(seller.createdAt ?? Date.now()).toISOString(),
  };
}

export function sellerFromRow(row: unknown): Seller {
  const fields = asRecord(row);
  return {
    id: String(fields.id ?? ""),
    uid: String(fields.uid ?? fields.id ?? ""),
    businessName: String(fields.business_name ?? ""),
    domain: String(fields.domain ?? ""),
    storeSlug: String(fields.store_slug ?? ""),
    template: fields.template === "template-b" ? "template-b" : "template-a",
    email: String(fields.email ?? ""),
    phone: String(fields.phone ?? ""),
    pricingTier: pricingTierFromColumn(fields.pricing_tier),
    baseFeeCedis: Number(fields.base_fee_cedis ?? 0),
    status: (fields.status as Seller["status"]) ?? "onboarding",
    createdAt: epochMs(fields.created_at),
  };
}

export function leadToInsert(lead: Omit<SignupLead, "id">) {
  return {
    business_name: lead.businessName,
    contact_name: lead.contactName,
    phone: lead.phone,
    email: lead.email,
    product_category: lead.productCategory,
    estimated_monthly_orders: lead.estimatedMonthlyOrders ?? null,
    notes: lead.notes ?? null,
  };
}

function optionalEpochMs(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const ms = epochMs(value);
  return ms || undefined;
}

function orderStatusFromUnknown(value: unknown): OrderStatus {
  const status = String(value ?? "");
  return ORDER_STATUSES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : "pending_payment";
}

function orderItemFromUnknown(value: unknown): OrderItem | null {
  const fields = asRecord(value);
  const productId = String(fields.productId ?? fields.product_id ?? "").trim();
  const name = String(fields.name ?? "").trim();
  if (!productId && !name) return null;
  const quantity = Number(fields.quantity ?? 0);
  const priceCedis = Number(fields.priceCedis ?? fields.price_cedis ?? fields.price ?? 0);
  const size = String(fields.size ?? "").trim();
  const color = String(fields.color ?? "").trim();
  return {
    productId,
    name: name || "Item",
    priceCedis: Number.isFinite(priceCedis) ? priceCedis : 0,
    quantity: Number.isFinite(quantity) ? quantity : 0,
    size: size || undefined,
    color: color || undefined,
  };
}

/** Map a customers row (snake_case) to the Customer type (camelCase). */
export function customerFromRow(row: unknown): Customer {
  const fields = asRecord(row);
  return {
    id: String(fields.id ?? ""),
    sellerId: String(fields.seller_id ?? ""),
    email: String(fields.email ?? ""),
    name: String(fields.name ?? ""),
    phone: String(fields.phone ?? ""),
    deliveryAddress: String(fields.delivery_address ?? ""),
    createdAt: epochMs(fields.created_at),
    updatedAt: epochMs(fields.updated_at),
  };
}

/** Map an orders row (snake_case) to the Order type (camelCase). */
export function orderFromRow(row: unknown): Order {
  const fields = asRecord(row);
  const rawItems = fields.items;
  const items = Array.isArray(rawItems)
    ? rawItems.map(orderItemFromUnknown).filter((item): item is OrderItem => Boolean(item))
    : [];
  const rider = String(fields.rider_service ?? "");
  return {
    id: String(fields.id ?? ""),
    sellerId: String(fields.seller_id ?? ""),
    customerId: String(fields.customer_id ?? "") || undefined,
    items,
    subtotalCedis: Number(fields.subtotal_cedis ?? 0),
    buyerName: String(fields.buyer_name ?? ""),
    buyerEmail: String(fields.buyer_email ?? ""),
    buyerPhone: String(fields.buyer_phone ?? ""),
    deliveryAddress: String(fields.delivery_address ?? ""),
    status: orderStatusFromUnknown(fields.status),
    paymentReference: String(fields.payment_reference ?? "") || undefined,
    packagingPhotoUrl: String(fields.packaging_photo_url ?? "") || undefined,
    packagingVideoUrl: String(fields.packaging_video_url ?? "") || undefined,
    riderService: rider === "yango" || rider === "in_house" ? rider : undefined,
    createdAt: epochMs(fields.created_at),
    packedAt: optionalEpochMs(fields.packed_at),
    dispatchedAt: optionalEpochMs(fields.dispatched_at),
  };
}

const STOREFRONT_EVENT_TYPES: StorefrontEventType[] = [
  "page_view",
  "product_view",
  "add_to_cart",
];

function storefrontEventTypeFromUnknown(value: unknown): StorefrontEventType {
  const type = String(value ?? "");
  return STOREFRONT_EVENT_TYPES.includes(type as StorefrontEventType)
    ? (type as StorefrontEventType)
    : "page_view";
}

/** Map a storefront_events row (snake_case) to StorefrontEvent (camelCase). */
export function storefrontEventFromRow(row: unknown): StorefrontEvent {
  const fields = asRecord(row);
  return {
    id: String(fields.id ?? ""),
    sellerId: String(fields.seller_id ?? ""),
    eventType: storefrontEventTypeFromUnknown(fields.event_type),
    path: String(fields.path ?? ""),
    productId: String(fields.product_id ?? "") || undefined,
    sessionId: String(fields.session_id ?? ""),
    createdAt: epochMs(fields.created_at),
  };
}

export function productToInsert(product: Omit<Product, "id">) {
  return {
    seller_id: product.sellerId,
    name: product.name,
    description: product.description,
    short_description: product.shortDescription ?? "",
    price_cedis: product.priceCedis,
    compare_at_price_cedis: product.compareAtPriceCedis ?? null,
    images: product.images,
    stock_quantity: product.stockQuantity,
    sku: product.sku,
    category: product.category,
    active: product.active,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    variants: product.variants ?? [],
  };
}
