import type { Product } from "@ansaa/shared/types";

export const IMPORTS_TEMPLATE_BASE = "/store/imports-template";

export type ImportsDemoProduct = {
  id: string;
  name: string;
  description: string;
  priceCedis: number;
  compareAtPriceCedis?: number;
  shortDescription?: string;
  category: string;
  createdAt: number;
  features?: string[];
};

export const IMPORTS_DEMO_PRODUCTS: ImportsDemoProduct[] = [
  {
    id: "demo-digestive-biscuits",
    name: "Wholemeal Digestive Biscuits",
    description:
      "A family pack of wholemeal digestives. Pair with tea, or keep in the cupboard for after school.",
    shortDescription: "Family pack of wholemeal digestives.",
    priceCedis: 45,
    compareAtPriceCedis: 55,
    category: "Biscuits",
    createdAt: 6,
    features: ["Family pack", "Wholemeal wheat", "Imported"],
  },
  {
    id: "demo-tinned-tuna",
    name: "Tuna Chunks in Sunflower Oil",
    description: "Solid tuna chunks packed in sunflower oil. Ready for jollof, salads, or a quick sandwich.",
    shortDescription: "Solid tuna chunks in sunflower oil.",
    priceCedis: 38,
    category: "Tinned fish",
    createdAt: 5,
    features: ["Sunflower oil", "Ready to eat", "Imported"],
  },
  {
    id: "demo-english-breakfast-tea",
    name: "English Breakfast Tea, 80 bags",
    description: "A full-bodied breakfast tea. 80 bags in a foil wrap to keep the flavour.",
    shortDescription: "80-bag breakfast tea.",
    priceCedis: 62,
    compareAtPriceCedis: 75,
    category: "Tea",
    createdAt: 4,
    features: ["80 bags", "Foil wrapped", "Strong brew"],
  },
  {
    id: "demo-evaporated-milk",
    name: "Evaporated Milk 410g",
    description: "Unsweetened evaporated milk for tea, porridge, and baking. Shelf-stable tin.",
    priceCedis: 28,
    category: "Milk",
    createdAt: 3,
    features: ["Unsweetened", "410g tin", "Shelf stable"],
  },
  {
    id: "demo-plum-tomatoes",
    name: "Peeled Plum Tomatoes 400g",
    description: "Peeled plum tomatoes in juice. A weeknight shortcut for stews and sauces.",
    priceCedis: 22,
    category: "Tomatoes",
    createdAt: 2,
    features: ["Peeled plum", "400g", "Stew ready"],
  },
  {
    id: "demo-sardines",
    name: "Sardines in Tomato Sauce",
    description: "Classic sardines in a rich tomato sauce. Serve with rice or bread.",
    priceCedis: 24,
    category: "Tinned fish",
    createdAt: 1,
    features: ["Tomato sauce", "Ready to eat", "Imported"],
  },
];

export const IMPORTS_DEMO_FAQS = [
  {
    question: "How do I pay?",
    answer:
      "Place the order on the site, then send Mobile Money to the number shown on the confirmation screen. The seller marks the order paid once they receive it.",
  },
  {
    question: "Where do you deliver?",
    answer: "Accra usually next day. Other regions typically arrive 2–4 days after dispatch.",
  },
  {
    question: "Are the goods imported?",
    answer: "Yes. This shop is set up for everyday imported groceries priced in Ghana Cedis.",
  },
];

export function getImportsDemoProduct(id: string): ImportsDemoProduct | undefined {
  return IMPORTS_DEMO_PRODUCTS.find((item) => item.id === id);
}

export function importsDemoToProduct(item: ImportsDemoProduct): Product {
  return {
    id: item.id,
    sellerId: "demo",
    name: item.name,
    description: item.description,
    shortDescription: item.shortDescription,
    priceCedis: item.priceCedis,
    compareAtPriceCedis: item.compareAtPriceCedis,
    images: [],
    stockQuantity: 20,
    sku: item.id.replace(/-/g, "").toUpperCase(),
    category: item.category,
    active: true,
    createdAt: item.createdAt,
    features: item.features ?? [],
  };
}
