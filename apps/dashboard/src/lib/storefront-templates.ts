import { templateHasBlog, type StorefrontTemplate } from "@ansaa/shared/types";

export const STOREFRONT_TEMPLATE_OPTIONS: Array<{
  id: StorefrontTemplate;
  name: string;
  description: string;
  previewClass: string;
  /** Same screenshots as the marketing homepage, when available. */
  previewImage?: string;
}> = [
  {
    id: "template-a",
    name: "Studio",
    description: "Minimal boutique layout, for fashion and beauty sellers.",
    previewClass: "bg-gradient-to-br from-zinc-100 via-white to-orange-100",
  },
  {
    id: "template-b",
    name: "Market",
    description: "Dense bold grid, for electronics and general goods.",
    previewClass: "bg-gradient-to-br from-ink-950 via-ink-800 to-amber-700",
  },
  {
    id: "kitchenware-template",
    name: "Kitchenware",
    description: "Warm editorial layout, for home and kitchen goods.",
    previewClass: "bg-gradient-to-br from-emerald-50 via-stone-100 to-amber-100",
    previewImage: "/marketing/kitchenware-preview.jpg",
  },
  {
    id: "template-d",
    name: "Stylehive",
    description: "Monochrome streetwear layout, for apparel sellers.",
    previewClass: "bg-gradient-to-br from-black via-zinc-800 to-zinc-500",
  },
  {
    id: "motorbike-template",
    name: "Ride",
    description: "Dark vehicle-retail layout, for motorbikes, bicycles, mopeds, and scooters.",
    previewClass: "bg-gradient-to-br from-neutral-950 via-neutral-800 to-orange-700",
    previewImage: "/marketing/ride-preview.jpg",
  },
];

export const PRODUCT_CATEGORY_SUGGESTIONS = [
  "Fashion",
  "Beauty & cosmetics",
  "Phone accessories",
  "Home goods",
  "Baby items",
  "Stationery",
] as const;

export const WEBSITE_ADMIN_FEATURES = [
  "Storefront on your own domain",
  "Pick from 5 templates",
  "Admin dashboard for orders, products, and sales",
  "Manual MoMo payments. You mark orders paid, unpaid, or cancelled",
  "Email support",
] as const;

export const FULFILMENT_FEATURES = [
  "Everything in Website & Admin",
  "We store your stock",
  "We pack and dispatch every order",
  "Photo proof at intake and before dispatch",
  "Priority support",
] as const;

export function templateLabel(id: StorefrontTemplate): string {
  return STOREFRONT_TEMPLATE_OPTIONS.find((option) => option.id === id)?.name ?? id;
}

export { templateHasBlog };
