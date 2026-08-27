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
