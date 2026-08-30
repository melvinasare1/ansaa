import type { Product, ProductVariant } from "@ansaa/shared/types";

export type DraftVariant = {
  id: string;
  name: string;
  values: string[];
  sku: string;
  price: string;
  stock: string;
};

export type VariantImageGroup = {
  key: string;
  label: string;
  variantId: string;
  variantName: string;
};

function uniqueLabels(values: string[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const value of values) {
    const label = value.trim();
    if (!label) continue;
    const id = label.toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    labels.push(label);
  }
  return labels;
}

export function variantImageGroupKey(variantId: string, value: string): string {
  return `${variantId}:::${value.trim().toLowerCase()}`;
}

export function variantImageGroups(variants: DraftVariant[]): VariantImageGroup[] {
  const groups: VariantImageGroup[] = [];
  for (const row of variants) {
    const variantName = row.name.trim() || "Variant";
    for (const value of uniqueLabels(row.values)) {
      groups.push({
        key: variantImageGroupKey(row.id, value),
        label: value,
        variantId: row.id,
        variantName,
      });
    }
  }
  return groups;
}

export function emptyManualVariant(): DraftVariant {
  return {
    id: crypto.randomUUID(),
    name: "",
    values: [],
    sku: "",
    price: "",
    stock: "",
  };
}

export function storefrontSizesAndColors(variants: DraftVariant[]): {
  sizes: string[];
  colors: string[];
} {
  const colorRow = variants.find((row) => /colou?r/i.test(row.name));
  const sizeRow = variants.find((row) => /size/i.test(row.name));
  const colors = uniqueLabels(colorRow?.values ?? []);
  const sizes = uniqueLabels(sizeRow?.values ?? []);
  if (colors.length > 0) return { sizes, colors };

  const fallback = variants.find((row) => row.id !== sizeRow?.id && row.values.length > 0);
  return { sizes, colors: uniqueLabels(fallback?.values ?? []) };
}

function variantValues(row: ProductVariant): string[] {
  if (row.values?.length) return uniqueLabels(row.values);
  return uniqueLabels([row.size ?? "", row.color ?? ""]);
}

export function draftVariantsFromProduct(product: Product): DraftVariant[] {
  if (product.variants?.length) {
    return product.variants.map((row) => ({
      id: row.id,
      name: row.name ?? (row.color ? "Color" : row.size ? "Size" : ""),
      values: variantValues(row),
      sku: row.sku ?? "",
      price: Number.isFinite(row.priceCedis) ? String(row.priceCedis) : "",
      stock: Number.isFinite(row.stockQuantity) ? String(row.stockQuantity) : "",
    }));
  }

  const drafts: DraftVariant[] = [];
  if (product.sizes?.length) {
    drafts.push({
      id: crypto.randomUUID(),
      name: "Size",
      values: uniqueLabels(product.sizes),
      sku: product.sku,
      price: String(product.priceCedis),
      stock: String(product.stockQuantity),
    });
  }
  if (product.colors?.length) {
    drafts.push({
      id: crypto.randomUUID(),
      name: "Color",
      values: uniqueLabels(product.colors),
      sku: product.sku,
      price: String(product.priceCedis),
      stock: String(product.stockQuantity),
    });
  }
  return drafts;
}

export function collectProductImageUrls(product: Product): string[] {
  const urls = [...product.images];
  for (const row of product.variants ?? []) {
    urls.push(...row.images);
    if (row.imagesByValue) urls.push(...Object.values(row.imagesByValue).flat());
  }
  return uniqueLabels(urls);
}

export function listingColourNames(product: Product, drafts: DraftVariant[]): string[] {
  const fromVariants = new Set(storefrontSizesAndColors(drafts).colors.map((name) => name.toLowerCase()));
  return uniqueLabels((product.colors ?? []).filter((name) => !fromVariants.has(name.toLowerCase())));
}

export function variantImageAssignmentsFromProduct(
  product: Product,
  slots: Array<{ id: string; publicUrl?: string; previewUrl: string }>
): Record<string, string[]> {
  const urlToId = new Map<string, string>();
  for (const slot of slots) {
    const url = slot.publicUrl ?? slot.previewUrl;
    if (url) urlToId.set(url, slot.id);
  }

  const assignments: Record<string, string[]> = {};
  for (const row of product.variants ?? []) {
    const byValue = row.imagesByValue ?? {};
    for (const value of variantValues(row)) {
      const key = value.toLowerCase();
      const urls =
        byValue[value] ??
        Object.entries(byValue).find(([label]) => label.toLowerCase() === key)?.[1] ??
        [];
      const ids = urls.map((url) => urlToId.get(url)).filter((id): id is string => Boolean(id));
      if (ids.length) assignments[variantImageGroupKey(row.id, value)] = ids;
    }
  }
  return assignments;
}
