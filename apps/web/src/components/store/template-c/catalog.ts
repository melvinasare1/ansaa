import type { Product, StoreFaq } from "@ansaa/shared/types";
import {
  getLiveProduct,
  getLiveSellerFaqs,
  isLiveStorefrontCatalog,
  listLiveProducts,
} from "@/lib/live-catalog";
import { formatCedis } from "@/lib/price";
import {
  TEMPLATE_C_DEMO_FAQS,
  TEMPLATE_C_DEMO_PRODUCTS,
  getTemplateCDemoProduct,
  templateCDemoToProduct,
} from "@/components/store/template-c/demo-catalog";
import type { KitchenProduct } from "@/components/store/template-c/ProductCarousel";

const BADGES: KitchenProduct["badge"][] = ["Promotion", "New", "Customer favorite"];

export async function listTemplateCProducts(): Promise<Product[]> {
  if (isLiveStorefrontCatalog()) return listLiveProducts();
  return TEMPLATE_C_DEMO_PRODUCTS.map(templateCDemoToProduct);
}

export async function getTemplateCProduct(productId: string): Promise<Product | null> {
  if (isLiveStorefrontCatalog()) return getLiveProduct(productId);
  const demo = getTemplateCDemoProduct(productId);
  return demo ? templateCDemoToProduct(demo) : null;
}

export async function getTemplateCProductPage(productId: string): Promise<{
  product: Product;
  faqs: StoreFaq[];
} | null> {
  const product = await getTemplateCProduct(productId);
  if (!product) return null;
  const faqs = isLiveStorefrontCatalog() ? await getLiveSellerFaqs() : TEMPLATE_C_DEMO_FAQS;
  return { product, faqs };
}

export function productToKitchenCard(product: Product, index: number): KitchenProduct {
  return {
    id: product.id,
    name: product.name,
    price: formatCedis(product.priceCedis),
    priceCedis: product.priceCedis,
    badge: BADGES[index % BADGES.length],
    colors: product.colors?.length ? product.colors : ["#2B4239", "#C4B89A"],
    image: product.images[0] ?? "",
    imageAlt: product.name,
  };
}

export async function listTemplateCCarousel(): Promise<KitchenProduct[]> {
  return (await listTemplateCProducts()).map(productToKitchenCard);
}
