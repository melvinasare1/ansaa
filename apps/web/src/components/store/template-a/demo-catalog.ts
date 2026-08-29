import type { Product } from "@ansaa/shared/types";

export type TemplateADemoProduct = {
  id: string;
  name: string;
  description: string;
  priceCedis: number;
  category: string;
  createdAt: number;
  colors: string[];
  sizes: string[];
  features?: string[];
};

export const TEMPLATE_A_DEMO_PRODUCTS: TemplateADemoProduct[] = [
  {
    id: "demo-oxford-shirt",
    name: "Everyday Oxford Shirt",
    description: "A crisp cotton oxford for the office and weekends. Relaxed through the body with a classic collar.",
    priceCedis: 280,
    category: "Tops & Tees",
    createdAt: 6,
    colors: ["#FFFFFF", "#1C7ED6", "#111111"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Breathable cotton", "Easy-iron collar", "Made for everyday wear"],
  },
  {
    id: "demo-denim-jacket",
    name: "Washed Denim Jacket",
    description: "Medium-wash denim with a straight cut and metal buttons. Layer over tees or knitwear.",
    priceCedis: 420,
    category: "Jackets & Coats",
    createdAt: 5,
    colors: ["#1C7ED6", "#111111"],
    sizes: ["S", "M", "L"],
    features: ["Medium-wash denim", "Metal buttons", "Layer over tees or knits"],
  },
  {
    id: "demo-knit-sweater",
    name: "Merino Crew Knit",
    description: "Soft merino crewneck that holds its shape. Fine gauge for cooler evenings without bulk.",
    priceCedis: 360,
    category: "Knitwear",
    createdAt: 4,
    colors: ["#C08A4D", "#ADB5BD", "#2F9E44"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Fine-gauge merino", "Holds its shape", "Cool-evening weight"],
  },
  {
    id: "demo-wide-pants",
    name: "Wide-Leg Trousers",
    description: "Tailored wide-leg trousers with a high rise and a clean drape. Pair with the oxford or knit.",
    priceCedis: 310,
    category: "Pants",
    createdAt: 3,
    colors: ["#111111", "#ADB5BD"],
    sizes: ["S", "M", "L"],
    features: ["High rise", "Clean drape", "Tailored wide leg"],
  },
  {
    id: "demo-summer-dress",
    name: "Linen Day Dress",
    description: "Breathable linen midi with a square neckline. Easy for warm days and evening plans.",
    priceCedis: 390,
    category: "Dresses",
    createdAt: 2,
    colors: ["#F783AC", "#F4C430", "#FFFFFF"],
    sizes: ["XS", "S", "M", "L"],
    features: ["Breathable linen", "Square neckline", "Midi length"],
  },
  {
    id: "demo-midi-skirt",
    name: "Pleated Midi Skirt",
    description: "Soft pleats that move without clinging. Wear with the crew knit or a tucked tee.",
    priceCedis: 250,
    category: "Skirts",
    createdAt: 1,
    colors: ["#7B2CBF", "#111111"],
    sizes: ["S", "M", "L"],
    features: ["Soft pleats", "Easy to pair", "Midi length"],
  },
];

export const TEMPLATE_A_DEMO_FAQS = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders in Accra usually go out within 24 hours. Other regions typically arrive in 2–4 days after dispatch.",
  },
  {
    question: "Can I return an item?",
    answer:
      "Yes — unused items with tags on can be returned within 7 days. Damaged or not-as-described items are always eligible.",
  },
  {
    question: "How do I choose a size?",
    answer:
      "Sizes follow a standard chart. If you are between sizes, size up for a relaxed fit or stay true to size for a closer cut.",
  },
];

export function getTemplateADemoProduct(id: string): TemplateADemoProduct | undefined {
  return TEMPLATE_A_DEMO_PRODUCTS.find((item) => item.id === id);
}

export function templateADemoToProduct(item: TemplateADemoProduct): Product {
  return {
    id: item.id,
    sellerId: "demo",
    name: item.name,
    description: item.description,
    priceCedis: item.priceCedis,
    images: [],
    stockQuantity: 14,
    sku: item.id.replace(/-/g, "").toUpperCase(),
    category: item.category,
    active: true,
    createdAt: item.createdAt,
    colors: item.colors,
    sizes: item.sizes,
    features: item.features ?? [],
  };
}
