import type { StorefrontTemplate } from "./types";

export type StorefrontContentFieldType = "text" | "textarea" | "image";

export type StorefrontContentField = {
  key: string;
  label: string;
  type: StorefrontContentFieldType;
  placeholder: string;
  page: string;
};

/** Seller-editable copy and image URLs, keyed by template field `key`. */
export type StorefrontContent = Record<string, string>;

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
};

/**
 * Pages that appear as editor tabs for each template, including pages
 * with no fields yet. Field `page` values are also included automatically.
 */
export const STOREFRONT_CONTENT_PAGES: Partial<Record<StorefrontTemplate, readonly string[]>> = {
  "template-a": ["home", "product", "cart"],
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

export function storefrontPageLabel(page: string): string {
  if (page === "home") return "Home";
  if (page === "product") return "Product";
  if (page === "cart") return "Cart";
  return page.charAt(0).toUpperCase() + page.slice(1);
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

/** Keep only keys declared for this template; coerce values to strings. */
export function storefrontContentForSave(
  fields: StorefrontContentField[],
  values: StorefrontContent
): StorefrontContent {
  const out: StorefrontContent = {};
  for (const field of fields) {
    out[field.key] = typeof values[field.key] === "string" ? values[field.key].trim() : "";
  }
  return out;
}
