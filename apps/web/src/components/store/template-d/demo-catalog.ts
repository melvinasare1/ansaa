import type { Product } from "@ansaa/shared/types";

export type TemplateDDemoProduct = {
  id: string;
  name: string;
  description: string;
  priceCedis: number;
  category: string;
  createdAt: number;
  image: string;
  gallery?: string[];
  colors: string[];
  sizes: string[];
  features?: string[];
};

export const TEMPLATE_D_DEMO_PRODUCTS: TemplateDDemoProduct[] = [
  {
    id: "demo-corduroy-jacket",
    name: "Cream Corduroy Jacket",
    description: "Wide-wale corduroy with a relaxed shoulder. Soft enough for all day, structured enough to wear out.",
    priceCedis: 480,
    category: "Jackets",
    createdAt: 6,
    image: "/template-d/card-corduroy.jpg",
    gallery: ["/template-d/cat-set.jpg", "/template-d/hero-model.jpg"],
    colors: ["#EFEFEF", "#C08A4D"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Wide-wale corduroy", "Relaxed shoulder", "All-day structure"],
  },
  {
    id: "demo-denim-hoodie-set",
    name: "Denim & Hoodie Set",
    description: "Light wash denim over a heavyweight hoodie. A full look without overthinking it.",
    priceCedis: 520,
    category: "Sets",
    createdAt: 5,
    image: "/template-d/prod-3.jpg",
    gallery: ["/template-d/cat-tee.jpg", "/template-d/card-corduroy.jpg"],
    colors: ["#ADB5BD", "#FFFFFF"],
    sizes: ["S", "M", "L"],
    features: ["Light-wash denim", "Heavyweight hoodie", "Worn as a set"],
  },
  {
    id: "demo-olive-cord-shirt",
    name: "Olive Cord Shirt",
    description: "Overshirt weight corduroy. Button through, chest pockets, and a straight hem for layering.",
    priceCedis: 290,
    category: "Shirts",
    createdAt: 4,
    image: "/template-d/cat-shirt.jpg",
    gallery: ["/template-d/card-corduroy.jpg", "/template-d/cat-set.jpg"],
    colors: ["#3D5348", "#111111"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Overshirt weight", "Chest pockets", "Straight hem"],
  },
  {
    id: "demo-rack-tee",
    name: "Everyday Heavy Tee",
    description: "Thick cotton tee that holds its shape after washes. Cut to sit clean under jackets.",
    priceCedis: 140,
    category: "T-Shirts",
    createdAt: 3,
    image: "/template-d/cat-tee.jpg",
    gallery: ["/template-d/prod-3.jpg", "/template-d/hero-model.jpg"],
    colors: ["#FFFFFF", "#111111", "#ADB5BD"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Heavy cotton jersey", "Holds shape after washes", "Clean under jackets"],
  },
  {
    id: "demo-navy-set",
    name: "Navy Set Collection",
    description: "Navy cord over a white hoodie. The shop's set look, ready as a pair.",
    priceCedis: 560,
    category: "Sets",
    createdAt: 2,
    image: "/template-d/cat-set.jpg",
    gallery: ["/template-d/card-corduroy.jpg", "/template-d/cat-shirt.jpg"],
    colors: ["#111111", "#FFFFFF"],
    sizes: ["S", "M", "L"],
    features: ["Navy cord layer", "White hoodie base", "Sold as a pair"],
  },
  {
    id: "demo-cargo-look",
    name: "Cargo Street Look",
    description: "Cargo trousers and a plaid layer. Built for movement, styled for the street.",
    priceCedis: 410,
    category: "Pants",
    createdAt: 1,
    image: "/template-d/hero-model.jpg",
    gallery: ["/template-d/prod-3.jpg", "/template-d/cat-tee.jpg"],
    colors: ["#C08A4D", "#111111"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Cargo trousers", "Plaid layer", "Built for movement"],
  },
];

export const TEMPLATE_D_DEMO_FAQS = [
  { question: "How do Stylehive sizes run?", answer: "True to size. If you like a looser street fit, size up on jackets and sets." },
  { question: "Can I mix pieces from a set?", answer: "Yes. Sets are photographed together, but you can wear each piece on its own." },
  { question: "Where do you ship?", answer: "Across Ghana. Accra deliveries are typically next day after confirmation." },
];

export function getTemplateDDemoProduct(id: string): TemplateDDemoProduct | undefined {
  return TEMPLATE_D_DEMO_PRODUCTS.find((item) => item.id === id);
}

export function templateDDemoToProduct(item: TemplateDDemoProduct): Product {
  return {
    id: item.id,
    sellerId: "demo",
    name: item.name,
    description: item.description,
    priceCedis: item.priceCedis,
    images: [item.image, ...(item.gallery ?? [])],
    features: item.features,
    stockQuantity: 9,
    sku: item.id.replace(/-/g, "").toUpperCase(),
    category: item.category,
    active: true,
    createdAt: item.createdAt,
    colors: item.colors,
    sizes: item.sizes,
  };
}
