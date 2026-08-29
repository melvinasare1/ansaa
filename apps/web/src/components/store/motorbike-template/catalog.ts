import type { Product } from "@ansaa/shared/types";
import {
  RIDE_DEMO_ACCESSORIES,
  RIDE_DEMO_PRODUCTS,
  RIDE_DEMO_VEHICLES,
  getRideDemoProduct,
  rideDemoToProduct,
  type RideDemoProduct,
} from "@/components/store/motorbike-template/demo-catalog";
import {
  getLiveRideProduct,
  isLiveRideCatalog,
  listLiveRideProducts,
  rideLiveStoreSlug,
} from "@/components/store/motorbike-template/live-catalog";
import { isAccessoryCategory } from "@/components/store/motorbike-template/vehicle-categories";

export { isLiveRideCatalog, rideLiveStoreSlug };

export type RideCatalogCard = {
  id: string;
  name: string;
  priceCedis: number;
  category: string;
  createdAt: number;
  image: string;
  colors: string[];
  rating?: number;
};

function productToCard(product: Product): RideCatalogCard {
  return {
    id: product.id,
    name: product.name,
    priceCedis: product.priceCedis,
    category: product.category,
    createdAt: product.createdAt,
    image: product.images[0] ?? "",
    colors: product.colors ?? [],
  };
}

function demoToCard(item: RideDemoProduct): RideCatalogCard {
  return {
    id: item.id,
    name: item.name,
    priceCedis: item.priceCedis,
    category: item.category,
    createdAt: item.createdAt,
    image: item.image,
    colors: item.colors,
    rating: item.rating,
  };
}

/**
 * Ride product data for this storefront.
 *
 * Template preview (Ansaa `/store/motorbike-template`): dummy catalog only.
 * After cloning onto a client project, set `NEXT_PUBLIC_STORE_SLUG` to the
 * seller's `store_slug` so listings and PDPs load from Supabase.
 */
export async function listRideProducts(): Promise<Product[]> {
  if (isLiveRideCatalog()) return listLiveRideProducts();
  return RIDE_DEMO_PRODUCTS.map(rideDemoToProduct);
}

export async function getRideProduct(productId: string): Promise<Product | null> {
  if (isLiveRideCatalog()) return getLiveRideProduct(productId);
  const demo = getRideDemoProduct(productId);
  return demo ? rideDemoToProduct(demo) : null;
}

export async function listRideSearchProducts(): Promise<RideCatalogCard[]> {
  if (isLiveRideCatalog()) {
    return (await listLiveRideProducts()).map(productToCard);
  }
  return RIDE_DEMO_VEHICLES.map(demoToCard);
}

export async function listRideAccessories(): Promise<RideCatalogCard[]> {
  if (isLiveRideCatalog()) {
    return (await listLiveRideProducts())
      .filter((product) => isAccessoryCategory(product.category))
      .map(productToCard);
  }
  return RIDE_DEMO_ACCESSORIES.map(demoToCard);
}
