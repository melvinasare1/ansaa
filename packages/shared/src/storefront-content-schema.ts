import type { StorefrontTemplate } from "./types";

export type StorefrontContentScalarType = "text" | "textarea" | "image";
export type StorefrontContentFieldType = StorefrontContentScalarType | "repeatable";

export type StorefrontContentItemField = {
  key: string;
  label: string;
  type: StorefrontContentScalarType;
  placeholder: string;
};

export type StorefrontContentScalarField = {
  key: string;
  label: string;
  type: StorefrontContentScalarType;
  placeholder: string;
  page: string;
};

export type StorefrontContentRepeatableField = {
  key: string;
  label: string;
  type: "repeatable";
  page: string;
  itemLabel: string;
  itemFields: StorefrontContentItemField[];
};

export type StorefrontContentField = StorefrontContentScalarField | StorefrontContentRepeatableField;

/** One row in a repeatable field (all sub-values are strings, including image URLs). */
export type StorefrontRepeatableItem = Record<string, string>;

/** Seller-editable copy, image URLs, and repeatable lists, keyed by template field `key`. */
export type StorefrontContentValue = string | StorefrontRepeatableItem[];
export type StorefrontContent = Record<string, StorefrontContentValue>;

export function isRepeatableField(
  field: StorefrontContentField
): field is StorefrontContentRepeatableField {
  return field.type === "repeatable";
}

function textField(
  key: string,
  label: string,
  placeholder: string,
  page: string
): StorefrontContentScalarField {
  return { key, label, type: "text", placeholder, page };
}

function textareaField(
  key: string,
  label: string,
  placeholder: string,
  page: string
): StorefrontContentScalarField {
  return { key, label, type: "textarea", placeholder, page };
}

function imageField(
  key: string,
  label: string,
  placeholder: string,
  page: string
): StorefrontContentScalarField {
  return { key, label, type: "image", placeholder, page };
}

function itemText(key: string, label: string, placeholder: string): StorefrontContentItemField {
  return { key, label, type: "text", placeholder };
}

function itemTextarea(key: string, label: string, placeholder: string): StorefrontContentItemField {
  return { key, label, type: "textarea", placeholder };
}

function itemImage(key: string, label: string, placeholder: string): StorefrontContentItemField {
  return { key, label, type: "image", placeholder };
}

/**
 * Editable storefront fields per template. The dashboard editor renders
 * from this list, grouped by each field's `page`. Adding template-b/c/d
 * (or a new page like `checkout`) is another entry here, not new form code.
 */
export const STOREFRONT_CONTENT_SCHEMA: Partial<
  Record<StorefrontTemplate, StorefrontContentField[]>
> = {
  "template-a": [
    {
      key: "heroHeadline",
      label: "Hero headline",
      type: "text",
      placeholder: "e.g. Men's Clothing",
      page: "home",
    },
    {
      key: "heroSubtext",
      label: "Hero subtext",
      type: "textarea",
      placeholder: "e.g. New season pieces, made to last.",
      page: "home",
    },
    {
      key: "heroImageUrl",
      label: "Hero image",
      type: "image",
      placeholder: "Wide photo for the top of your shop",
      page: "home",
    },
    {
      key: "aboutText",
      label: "About",
      type: "textarea",
      placeholder: "e.g. A short story about your brand.",
      page: "home",
    },
    {
      key: "logoUrl",
      label: "Logo",
      type: "image",
      placeholder: "Shown in the shop header",
      page: "home",
    },
  ],
  "motorbike-template": [
    imageField("logoUrl", "Logo", "Shown in the header and footer", "header"),

    textareaField(
      "heroHeadline",
      "Headline",
      "e.g. Ride Better.\nRide Together.",
      "hero"
    ),
    textareaField(
      "heroSubtext",
      "Subtext",
      "e.g. Motorbikes, bicycles, mopeds, and scooters…",
      "hero"
    ),
    imageField("heroImage", "Image", "Wide photo for the top of your shop", "hero"),

    {
      key: "trustBadges",
      label: "Trust badges",
      type: "repeatable",
      page: "trust-strip",
      itemLabel: "badge",
      itemFields: [itemText("label", "Label", "e.g. Warranty")],
    },

    textField("shopHeading", "Heading", "e.g. Shop", "shop"),
    {
      key: "shopCategories",
      label: "Category cards",
      type: "repeatable",
      page: "shop",
      itemLabel: "category",
      itemFields: [
        itemText("label", "Label", "e.g. Motorbikes"),
        itemImage("image", "Image", "Category photo"),
        itemText("linkCategory", "Search category", "e.g. motorbikes"),
      ],
    },

    textField("promoHeadline", "Headline", "e.g. Apex R9", "promo"),
    textField("promoKicker", "Kicker", "e.g. Street Motorbike", "promo"),
    textareaField(
      "promoBody",
      "Body",
      "e.g. Street-ready motorbike with a punchy engine…",
      "promo"
    ),
    imageField("promoImage", "Image", "Featured machine photo", "promo"),

    {
      key: "featureStrip",
      label: "Feature columns",
      type: "repeatable",
      page: "features",
      itemLabel: "feature",
      itemFields: [
        itemText("label", "Title", "e.g. Trusted Brands"),
        itemTextarea("body", "Body", "Short supporting sentence"),
      ],
    },

    textField("accessoriesHeading", "Heading", "e.g. Gear & Accessories", "accessories"),
    {
      key: "accessories",
      label: "Accessory products",
      type: "repeatable",
      page: "accessories",
      itemLabel: "accessory",
      itemFields: [
        itemText("name", "Name", "e.g. Motorbike Helmet"),
        itemImage("image", "Image", "Product photo"),
        itemText("price", "Price", "e.g. 450"),
        itemText("productId", "Product ID", "Optional listing id for the product page"),
      ],
    },

    {
      key: "valueProps",
      label: "Value columns",
      type: "repeatable",
      page: "value-props",
      itemLabel: "column",
      itemFields: [
        itemText("label", "Title", "e.g. Delivery Across Accra"),
        itemTextarea("body", "Body", "Short supporting sentence"),
      ],
    },

    textField("darkBannerHeadline", "Headline", "e.g. E-Bike", "dark-banner"),
    textareaField(
      "darkBannerBody",
      "Body",
      "e.g. Quiet power for city hops and weekend loops…",
      "dark-banner"
    ),
    imageField("darkBannerImage", "Image", "Banner photo", "dark-banner"),
    textField(
      "darkBannerCalloutTitle",
      "Callout title",
      "e.g. Super Powerful Battery",
      "dark-banner"
    ),
    textareaField(
      "darkBannerCalloutBody",
      "Callout body",
      "e.g. The best range ever seen for a bike like this.",
      "dark-banner"
    ),

    textField("blogHeading", "Heading", "e.g. Recent Blog Posts", "blog"),
    {
      key: "blogPosts",
      label: "Blog cards",
      type: "repeatable",
      page: "blog",
      itemLabel: "post",
      itemFields: [
        itemText("title", "Title", "Post title"),
        itemTextarea("excerpt", "Excerpt", "One or two sentences"),
        itemImage("image", "Image", "Card photo"),
        itemText("date", "Date", "e.g. 30 Aug 2026"),
        itemText("href", "Link", "Optional URL"),
      ],
    },

    textareaField(
      "footerTagline",
      "Tagline",
      "e.g. Motorbikes, bicycles, mopeds, and scooters…",
      "footer"
    ),
    textField(
      "footerNewsletterHeading",
      "Newsletter heading",
      "e.g. Signup for latest information",
      "footer"
    ),
    {
      key: "footerSocialLinks",
      label: "Social links",
      type: "repeatable",
      page: "footer",
      itemLabel: "link",
      itemFields: [
        itemText("network", "Network", "e.g. Instagram"),
        itemText("url", "URL", "https://…"),
      ],
    },

    textField("contactKicker", "Kicker", "e.g. Get in touch", "contact"),
    textField("contactHeadline", "Headline", "e.g. Contact Us", "contact"),
    textareaField(
      "contactSubtext",
      "Subtext",
      "Use {brandName} for your shop name. e.g. Call {brandName} directly.",
      "contact"
    ),
    textField("contactFormHeading", "Form heading", "e.g. Send a message", "contact"),
    textareaField(
      "contactFormIntro",
      "Form intro",
      "e.g. Tell us what you're looking for…",
      "contact"
    ),
    textField("contactWhatsappHeading", "WhatsApp heading", "e.g. Call or WhatsApp", "contact"),
    textareaField(
      "contactWhatsappBody",
      "WhatsApp body",
      "Use {brandName} for your shop name.",
      "contact"
    ),
  ],
};

/**
 * Pages that appear as editor tabs for each template, including pages
 * with no fields yet. Field `page` values are also included automatically.
 */
export const STOREFRONT_CONTENT_PAGES: Partial<Record<StorefrontTemplate, readonly string[]>> = {
  "template-a": ["home", "product", "cart"],
  "motorbike-template": [
    "header",
    "hero",
    "trust-strip",
    "shop",
    "promo",
    "features",
    "accessories",
    "value-props",
    "dark-banner",
    "blog",
    "footer",
    "contact",
  ],
};

export function getStorefrontContentFields(
  template: StorefrontTemplate,
  page?: string
): StorefrontContentField[] {
  const fields = STOREFRONT_CONTENT_SCHEMA[template] ?? [];
  return page ? fields.filter((field) => field.page === page) : fields;
}

/** Editor tabs for a template: declared pages plus any page ids found on fields. */
export function getStorefrontEditorPages(template: StorefrontTemplate): string[] {
  const seen = new Set<string>();
  const pages: string[] = [];
  for (const page of [
    ...(STOREFRONT_CONTENT_PAGES[template] ?? []),
    ...getStorefrontContentFields(template).map((field) => field.page),
  ]) {
    if (!page || seen.has(page)) continue;
    seen.add(page);
    pages.push(page);
  }
  return pages;
}

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  product: "Product",
  cart: "Cart",
  header: "Header",
  hero: "Hero",
  "trust-strip": "Trust Strip",
  shop: "Shop Categories",
  promo: "Promo Banner",
  features: "Features Strip",
  accessories: "Accessories",
  "value-props": "Value Props",
  "dark-banner": "Dark Feature Banner",
  blog: "Blog",
  footer: "Footer",
  contact: "Contact",
};

export function storefrontPageLabel(page: string): string {
  return PAGE_LABELS[page] ?? page.charAt(0).toUpperCase() + page.slice(1);
}

function parseRepeatableItem(value: unknown): StorefrontRepeatableItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const out: StorefrontRepeatableItem = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === "string") out[key] = entry;
    else if (typeof entry === "number" || typeof entry === "boolean") out[key] = String(entry);
  }
  return out;
}

export function parseStorefrontContent(value: unknown): StorefrontContent {
  let record: unknown = value;
  if (typeof value === "string") {
    try {
      record = JSON.parse(value) as unknown;
    } catch {
      return {};
    }
  }
  if (!record || typeof record !== "object" || Array.isArray(record)) return {};
  const out: StorefrontContent = {};
  for (const [key, entry] of Object.entries(record as Record<string, unknown>)) {
    if (typeof entry === "string") {
      out[key] = entry;
    } else if (typeof entry === "number" || typeof entry === "boolean") {
      out[key] = String(entry);
    } else if (Array.isArray(entry)) {
      out[key] = entry
        .map(parseRepeatableItem)
        .filter((item): item is StorefrontRepeatableItem => item != null);
    }
  }
  return out;
}

export function storefrontContentValue(
  content: StorefrontContent | undefined,
  key: string,
  fallback = ""
): string {
  const value = content?.[key];
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function storefrontContentItems(
  content: StorefrontContent | undefined,
  key: string
): StorefrontRepeatableItem[] {
  const value = content?.[key];
  return Array.isArray(value) ? value : [];
}

export function emptyRepeatableItem(field: StorefrontContentRepeatableField): StorefrontRepeatableItem {
  return Object.fromEntries(field.itemFields.map((item) => [item.key, ""]));
}

function itemHasContent(item: StorefrontRepeatableItem): boolean {
  return Object.values(item).some((value) => value.trim());
}

/** Repeatable rows that have at least one filled sub-field. Empty lists mean “use template fallbacks”. */
export function filledStorefrontContentItems(
  content: StorefrontContent | undefined,
  key: string
): StorefrontRepeatableItem[] {
  return storefrontContentItems(content, key).filter(itemHasContent);
}

function itemForSave(
  field: StorefrontContentRepeatableField,
  raw: StorefrontRepeatableItem
): StorefrontRepeatableItem {
  const out: StorefrontRepeatableItem = {};
  for (const itemField of field.itemFields) {
    const value = raw[itemField.key];
    out[itemField.key] = typeof value === "string" ? value.trim() : "";
  }
  return out;
}

/** Keep only keys declared for this template. */
export function storefrontContentForSave(
  fields: StorefrontContentField[],
  values: StorefrontContent
): StorefrontContent {
  const out: StorefrontContent = {};
  for (const field of fields) {
    if (isRepeatableField(field)) {
      const raw = values[field.key];
      const items = Array.isArray(raw) ? raw : [];
      out[field.key] = items.map((item) => itemForSave(field, item));
      continue;
    }
    const value = values[field.key];
    out[field.key] = typeof value === "string" ? value.trim() : "";
  }
  return out;
}
