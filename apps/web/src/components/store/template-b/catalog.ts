import type { Product, StoreFaq } from "@ansaa/shared/types";
import {
  getLiveProduct,
  getLiveSellerFaqs,
  isLiveStorefrontCatalog,
  listLiveProducts,
} from "@/lib/live-catalog";
import {
  TEMPLATE_B_DEMO_FAQS,
  TEMPLATE_B_DEMO_PRODUCTS,
  getTemplateBDemoProduct,
  templateBDemoToProduct,
} from "@/components/store/template-b/demo-catalog";

export async function listTemplateBProducts(): Promise<Product[]> {
  if (isLiveStorefrontCatalog()) return listLiveProducts();
  return TEMPLATE_B_DEMO_PRODUCTS.map(templateBDemoToProduct);
}

export async function getTemplateBProduct(productId: string): Promise<Product | null> {
  if (isLiveStorefrontCatalog()) return getLiveProduct(productId);
  const demo = getTemplateBDemoProduct(productId);
  return demo ? templateBDemoToProduct(demo) : null;
}

export async function getTemplateBProductPage(productId: string): Promise<{
  product: Product;
  faqs: StoreFaq[];
} | null> {
  const product = await getTemplateBProduct(productId);
  if (!product) return null;
  const faqs = isLiveStorefrontCatalog() ? await getLiveSellerFaqs() : TEMPLATE_B_DEMO_FAQS;
  return { product, faqs };
}
