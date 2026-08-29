import type { Product } from "@ansaa/shared/types";

export type TemplateBDemoProduct = {
  id: string;
  name: string;
  description: string;
  priceCedis: number;
  category: string;
  createdAt: number;
  stockQuantity: number;
  colors?: string[];
  features?: string[];
};

export const TEMPLATE_B_DEMO_PRODUCTS: TemplateBDemoProduct[] = [
  {
    id: "demo-rice-5kg",
    name: "Local rice — 5kg",
    description: "Long-grain rice packed for the week. Sealed bag, ready for the pantry.",
    priceCedis: 85,
    category: "Staples",
    createdAt: 6,
    stockQuantity: 24,
    colors: ["#FFE8A3"],
    features: ["Sealed 5kg bag", "Long-grain", "Ready for the pantry"],
  },
  {
    id: "demo-palm-oil",
    name: "Red palm oil — 1L",
    description: "Fresh palm oil in a sealed bottle. For stews, rice, and frying.",
    priceCedis: 45,
    category: "Oils",
    createdAt: 5,
    stockQuantity: 18,
    colors: ["#E8622C"],
    features: ["1 litre bottle", "Fresh press", "For stews and frying"],
  },
  {
    id: "demo-tomatoes",
    name: "Fresh tomatoes — pack",
    description: "Ripe tomatoes for soup and stew. Packed the morning of delivery.",
    priceCedis: 18,
    category: "Produce",
    createdAt: 4,
    stockQuantity: 40,
    colors: ["#E03131"],
    features: ["Packed same morning", "Ripe for stew", "Local produce"],
  },
  {
    id: "demo-eggs",
    name: "Farm eggs — crate of 12",
    description: "Medium eggs from nearby farms. Keep cool and use within two weeks.",
    priceCedis: 32,
    category: "Dairy",
    createdAt: 3,
    stockQuantity: 15,
    colors: ["#F4C430"],
    features: ["Crate of 12", "Farm fresh", "Keep cool"],
  },
  {
    id: "demo-bread",
    name: "Sugar bread loaf",
    description: "Soft loaf baked overnight. Best the same day, still good toasted tomorrow.",
    priceCedis: 12,
    category: "Bakery",
    createdAt: 2,
    stockQuantity: 20,
    colors: ["#C08A4D"],
    features: ["Baked overnight", "Soft loaf", "Best the same day"],
  },
  {
    id: "demo-soap",
    name: "Laundry soap bar",
    description: "Household soap for clothes and dishes. One bar lasts a typical week of washing.",
    priceCedis: 8,
    category: "Household",
    createdAt: 1,
    stockQuantity: 50,
    colors: ["#74C0FC"],
    features: ["Household bar", "Clothes and dishes", "Lasts a typical week"],
  },
];

export const TEMPLATE_B_DEMO_FAQS = [
  {
    question: "When do you dispatch?",
    answer: "Orders placed before 4pm go out the same day. Later orders leave the next morning.",
  },
  {
    question: "Can I swap an item?",
    answer: "Yes — message us with your ANS- reference before the rider leaves and we will swap it.",
  },
  {
    question: "How is food packed?",
    answer: "Staples go in sealed bags. Produce is packed the morning of delivery so it stays fresh.",
  },
];

export function getTemplateBDemoProduct(id: string): TemplateBDemoProduct | undefined {
  return TEMPLATE_B_DEMO_PRODUCTS.find((item) => item.id === id);
}

export function templateBDemoToProduct(item: TemplateBDemoProduct): Product {
  return {
    id: item.id,
    sellerId: "demo",
    name: item.name,
    description: item.description,
    priceCedis: item.priceCedis,
    images: [],
    stockQuantity: item.stockQuantity,
    sku: item.id.replace(/-/g, "").toUpperCase(),
    category: item.category,
    active: true,
    createdAt: item.createdAt,
    colors: item.colors,
    features: item.features ?? [],
  };
}
