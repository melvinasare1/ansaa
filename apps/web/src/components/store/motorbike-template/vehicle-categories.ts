export const VEHICLE_CATEGORIES = [
  {
    slug: "motorbikes",
    label: "Motorbikes",
    aliases: ["motorbike", "motorbikes", "motorcycle", "motorcycles"],
  },
  {
    slug: "bicycles",
    label: "Bicycles",
    aliases: ["bicycle", "bicycles", "bike", "bikes", "e-bike", "e-bikes", "ebike", "ebikes"],
  },
  {
    slug: "mopeds",
    label: "Mopeds",
    aliases: ["moped", "mopeds"],
  },
  {
    slug: "scooters",
    label: "Scooters",
    aliases: ["scooter", "scooters"],
  },
] as const;

export type VehicleCategorySlug = (typeof VEHICLE_CATEGORIES)[number]["slug"];

function normalizeCategoryValue(value: string): string {
  return value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function categoryKey(value: string): string {
  return normalizeCategoryValue(value).replace(/\s+/g, "");
}

export function parseVehicleCategoryParam(
  value: string | string[] | undefined
): VehicleCategorySlug[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  const seen = new Set<VehicleCategorySlug>();
  for (const entry of raw) {
    const key = categoryKey(entry);
    const match = VEHICLE_CATEGORIES.find(
      (category) => category.slug === key || category.aliases.some((alias) => categoryKey(alias) === key)
    );
    if (match && !seen.has(match.slug)) seen.add(match.slug);
  }
  return [...seen];
}

export function productMatchesVehicleCategory(
  productCategory: string,
  slug: VehicleCategorySlug
): boolean {
  const key = categoryKey(productCategory);
  const category = VEHICLE_CATEGORIES.find((item) => item.slug === slug);
  if (!category || !key) return false;
  return category.slug === key || category.aliases.some((alias) => categoryKey(alias) === key);
}

export type SearchSort = "newest" | "price-asc" | "price-desc";

export function parseSearchSort(value: string | undefined): SearchSort {
  if (value === "price-asc" || value === "price-desc" || value === "newest") return value;
  return "newest";
}

export function parsePriceBound(value: string | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return amount;
}

const ACCESSORY_CATEGORY_ALIASES = [
  "helmet",
  "helmets",
  "gear",
  "accessory",
  "accessories",
  "part",
  "parts",
  "jacket",
  "jackets",
  "glove",
  "gloves",
  "boot",
  "boots",
  "trouser",
  "trousers",
] as const;

export function isAccessoryCategory(productCategory: string): boolean {
  const normalized = normalizeCategoryValue(productCategory);
  if (!normalized) return false;
  return ACCESSORY_CATEGORY_ALIASES.some((alias) => {
    const token = normalizeCategoryValue(alias);
    return normalized === token || normalized.includes(token);
  });
}

/** Other active listings to show under a product. Prefers gear/accessories. */
export function pickRelatedProducts<T extends { id: string; category: string }>(
  current: T,
  catalog: T[],
  limit = 4
): T[] {
  const others = catalog.filter((item) => item.id !== current.id);
  const accessories = others.filter((item) => isAccessoryCategory(item.category));
  const pool =
    accessories.length > 0
      ? accessories
      : others.filter((item) => categoryKey(item.category) !== categoryKey(current.category));
  return pool.slice(0, limit);
}
