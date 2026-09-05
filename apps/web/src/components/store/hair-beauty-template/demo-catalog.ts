import type { Product, ProductVariant } from "@ansaa/shared/types";

export const HAIR_BEAUTY_TEMPLATE_BASE = "/store/hair-beauty-template";

const HERO = "/store/hair-beauty-template/hero.jpg";

export type HairDemoProduct = {
  id: string;
  name: string;
  description: string;
  priceCedis: number;
  compareAtPriceCedis?: number;
  shortDescription?: string;
  category: string;
  image: string;
  createdAt: number;
  features?: string[];
  variants?: ProductVariant[];
};

export const HAIR_DEMO_PRODUCTS: HairDemoProduct[] = [
  {
    id: "demo-silk-straight-bundle",
    name: "Silk Straight Bundle Set",
    description:
      "100% human hair straight bundles with a soft, glossy finish. Choose length and texture to match your install — double weft for fullness that lasts.",
    shortDescription: "Premium human hair bundles. Pick length and texture.",
    priceCedis: 850,
    compareAtPriceCedis: 980,
    category: "Bundles",
    image: HERO,
    createdAt: 6,
    features: ["100% human hair", "Double weft", "Low shedding"],
    variants: [
      {
        id: "demo-silk-straight-length",
        name: "Length",
        values: ['14"', '18"', '22"', '26"'],
        sku: "HAIRBUNDLE-LEN",
        priceCedis: 850,
        stockQuantity: 12,
        images: [],
      },
      {
        id: "demo-silk-straight-texture",
        name: "Texture",
        values: ["Straight", "Body Wave", "Deep Wave"],
        sku: "HAIRBUNDLE-TEX",
        priceCedis: 850,
        stockQuantity: 12,
        images: [],
      },
    ],
  },
  {
    id: "demo-lace-front-wig",
    name: "13×4 Lace Front Wig",
    description:
      "Pre-plucked lace front wig with a natural hairline. Lightweight cap, breathable, and ready to style for everyday glam or special occasions.",
    shortDescription: "Natural hairline lace front. Ready to wear.",
    priceCedis: 1250,
    category: "Wigs",
    image: HERO,
    createdAt: 5,
    features: ["13×4 lace", "Pre-plucked", "Adjustable straps"],
  },
  {
    id: "demo-body-wave-closure",
    name: "Body Wave 4×4 Closure",
    description:
      "Medium brown lace closure with soft body wave texture. Bleach-friendly knots and a seamless blend with matching bundles.",
    shortDescription: "Soft body wave closure for a flawless finish.",
    priceCedis: 320,
    compareAtPriceCedis: 380,
    category: "Closures",
    image: HERO,
    createdAt: 4,
    features: ["4×4 lace", "Medium brown", "Bleach-friendly knots"],
  },
  {
    id: "demo-kinky-curly-wig",
    name: "Kinky Curly Full Wig",
    description:
      "Full-density kinky curly unit with soft stretch and bounce. Holds curl definition after wash and air-dry — no heat required.",
    shortDescription: "Full-density curls with lasting definition.",
    priceCedis: 1100,
    category: "Wigs",
    image: HERO,
    createdAt: 3,
    features: ["High density", "Heat-friendly", "Wash & go"],
  },
  {
    id: "demo-clip-in-extensions",
    name: "Clip-In Extension Set",
    description:
      "Seven-piece clip-in set for instant length and volume. Easy to install and remove — ideal for weekends, shoots, and travel.",
    shortDescription: "Seven-piece clip-ins for instant volume.",
    priceCedis: 480,
    category: "Extensions",
    image: HERO,
    createdAt: 2,
    features: ["7 pieces", "Secure clips", "Reusable"],
  },
  {
    id: "demo-frontal-bundle-deal",
    name: "Frontal + Bundle Deal",
    description:
      "Ear-to-ear frontal paired with two matching bundles. One cart add for a complete sew-in look — colour-matched and ready to ship.",
    shortDescription: "Frontal plus two bundles, colour-matched.",
    priceCedis: 1450,
    compareAtPriceCedis: 1650,
    category: "Bundles",
    image: HERO,
    createdAt: 1,
    features: ["13×4 frontal", "2 bundles", "Colour-matched"],
  },
];

export const HAIR_DEMO_FAQS = [
  {
    question: "How do I pay?",
    answer:
      "Place the order on the site, then send Mobile Money to the number shown on the confirmation screen. The seller marks the order paid once they receive it.",
  },
  {
    question: "Is the hair 100% human?",
    answer:
      "Yes. Demo catalogue pieces are listed as premium human hair. Live shops set their own product details and care notes.",
  },
  {
    question: "Where do you deliver?",
    answer: "Accra usually next day. Other regions typically arrive 2–4 days after dispatch.",
  },
];

export function getHairDemoProduct(id: string): HairDemoProduct | undefined {
  return HAIR_DEMO_PRODUCTS.find((item) => item.id === id);
}

export function hairDemoToProduct(item: HairDemoProduct): Product {
  return {
    id: item.id,
    sellerId: "demo",
    name: item.name,
    description: item.description,
    shortDescription: item.shortDescription,
    priceCedis: item.priceCedis,
    compareAtPriceCedis: item.compareAtPriceCedis,
    images: [item.image],
    stockQuantity: 16,
    sku: item.id.replace(/-/g, "").toUpperCase(),
    category: item.category,
    active: true,
    createdAt: item.createdAt,
    features: item.features ?? [],
    variants: item.variants,
  };
}
