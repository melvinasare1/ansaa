import type { Product } from "@ansaa/shared/types";

export const RIDE_TEMPLATE_BASE = "/store/motorbike-template";

export type RideDemoProduct = {
  id: string;
  name: string;
  description: string;
  priceCedis: number;
  category: string;
  createdAt: number;
  image: string;
  colors: string[];
  rating?: number;
};

const IMAGES = {
  motorbike: "/store/motorbike-template/motorbike.png",
  moped: "/store/motorbike-template/moped.png",
  classic: "/store/motorbike-template/classic.png",
  ebike: "/store/motorbike-template/ebike.png",
  helmet: "/store/motorbike-template/helmet.png",
  jacket: "/store/motorbike-template/jacket.png",
  gloves: "/store/motorbike-template/gloves.png",
  gopro: "/store/motorbike-template/gopro.png",
  trousers: "/store/motorbike-template/trousers.png",
  boots: "/store/motorbike-template/boots.png",
} as const;

export const RIDE_DEMO_VEHICLES: RideDemoProduct[] = [
  {
    id: "demo-motorbike-1",
    name: "Apex R9",
    description:
      "Street-ready motorbike with a punchy engine, upright seating, and the range to cover town and the open road.",
    priceCedis: 18900,
    category: "Motorbikes",
    createdAt: 4,
    image: IMAGES.motorbike,
    colors: ["#111111", "#E8622C"],
  },
  {
    id: "demo-bicycle-1",
    name: "City E-Bike",
    description:
      "Quiet power for city hops and weekend loops — a removable battery, disc brakes, and a ride that stays composed in traffic.",
    priceCedis: 9450,
    category: "Bicycles",
    createdAt: 3,
    image: IMAGES.ebike,
    colors: ["#111111", "#FFFFFF"],
  },
  {
    id: "demo-moped-1",
    name: "Urban Moped",
    description:
      "A compact commuter for short trips and tight streets — light, easy to park, and ready for daily errands.",
    priceCedis: 6200,
    category: "Mopeds",
    createdAt: 2,
    image: IMAGES.moped,
    colors: ["#111111", "#ADB5BD"],
  },
  {
    id: "demo-scooter-1",
    name: "Classic Scooter",
    description:
      "A simple, stylish scooter for neighborhood runs — step-through frame, under-seat storage, and an easy sit-up ride.",
    priceCedis: 4800,
    category: "Scooters",
    createdAt: 1,
    image: IMAGES.classic,
    colors: ["#111111", "#FFFFFF"],
  },
];

export const RIDE_DEMO_ACCESSORIES: RideDemoProduct[] = [
  {
    id: "demo-helmet",
    name: "Motorbike Helmet",
    description: "Full-face helmet with a wide visor and a secure fit for daily commuting and weekend rides.",
    priceCedis: 450,
    category: "Helmets",
    createdAt: 10,
    image: IMAGES.helmet,
    colors: ["#111111", "#3A3A3A"],
    rating: 5,
  },
  {
    id: "demo-jacket",
    name: "Motorbike Jacket",
    description: "Armored riding jacket with a weather-ready shell and a cut that stays comfortable on longer rides.",
    priceCedis: 890,
    category: "Jackets",
    createdAt: 9,
    image: IMAGES.jacket,
    colors: ["#111111", "#FFFFFF", "#C0392B"],
    rating: 5,
  },
  {
    id: "demo-gloves",
    name: "Motorbike Gloves",
    description: "Protective riding gloves with palm grip and knuckle coverage for control in all weather.",
    priceCedis: 95,
    category: "Gloves",
    createdAt: 8,
    image: IMAGES.gloves,
    colors: ["#111111", "#ADB5BD"],
    rating: 4,
  },
  {
    id: "demo-gopro",
    name: "Go Pro Camera",
    description: "A compact action camera for recording street rides, trail days, and workshop setups.",
    priceCedis: 720,
    category: "Accessories",
    createdAt: 7,
    image: IMAGES.gopro,
    colors: ["#111111", "#3B82F6"],
    rating: 5,
  },
  {
    id: "demo-trousers",
    name: "Motorbike Trousers",
    description: "Reinforced riding trousers with stretch panels and armor pockets for commuting and touring.",
    priceCedis: 640,
    category: "Trousers",
    createdAt: 6,
    image: IMAGES.trousers,
    colors: ["#111111", "#FFFFFF"],
    rating: 4,
  },
  {
    id: "demo-boots",
    name: "Motorbike Boots",
    description: "Sturdy riding boots with ankle support and a sole that grips wet pavement and pegs.",
    priceCedis: 380,
    category: "Boots",
    createdAt: 5,
    image: IMAGES.boots,
    colors: ["#111111", "#FFFFFF"],
    rating: 4,
  },
];

export const RIDE_DEMO_PRODUCTS: RideDemoProduct[] = [
  ...RIDE_DEMO_VEHICLES,
  ...RIDE_DEMO_ACCESSORIES,
];

export function getRideDemoProduct(id: string): RideDemoProduct | undefined {
  return RIDE_DEMO_PRODUCTS.find((item) => item.id === id);
}

export function isRideDemoProductId(id: string): boolean {
  return Boolean(getRideDemoProduct(id));
}

/** Preview-only MoMo number for the dummy Ride catalog. */
export const RIDE_DEMO_MOMO_NUMBER = "0240000000";

export function rideDemoToProduct(item: RideDemoProduct): Product {
  return {
    id: item.id,
    sellerId: "demo",
    name: item.name,
    description: item.description,
    priceCedis: item.priceCedis,
    images: item.image ? [item.image] : [],
    stockQuantity: 8,
    sku: item.id.replace(/-/g, "").toUpperCase(),
    category: item.category,
    active: true,
    createdAt: item.createdAt,
    colors: item.colors,
  };
}

export function rideProductPath(productId: string): string {
  return `${RIDE_TEMPLATE_BASE}/product/${productId}`;
}

export function rideCartPath(sellerSlug?: string): string {
  if (sellerSlug) return `${RIDE_TEMPLATE_BASE}/${sellerSlug}/cart`;
  return `${RIDE_TEMPLATE_BASE}/cart`;
}

const RESERVED_PATH_SEGMENTS = new Set(["search", "blog", "product", "cart"]);

export function rideCartHrefFromPath(pathname: string): string {
  const match = pathname.match(/^\/store\/motorbike-template\/([^/]+)/);
  const segment = match?.[1] ?? "";
  if (segment && !RESERVED_PATH_SEGMENTS.has(segment)) return rideCartPath(segment);
  return rideCartPath();
}
