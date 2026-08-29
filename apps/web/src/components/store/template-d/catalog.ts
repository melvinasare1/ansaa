import type { Product, StoreFaq } from "@ansaa/shared/types";
import {
  getLiveProduct,
  getLiveSellerFaqs,
  isLiveStorefrontCatalog,
  listLiveProducts,
} from "@/lib/live-catalog";
import {
  TEMPLATE_D_DEMO_FAQS,
  TEMPLATE_D_DEMO_PRODUCTS,
  getTemplateDDemoProduct,
  templateDDemoToProduct,
} from "@/components/store/template-d/demo-catalog";

export async function listTemplateDProducts(): Promise<Product[]> {
  if (isLiveStorefrontCatalog()) return listLiveProducts();
  return TEMPLATE_D_DEMO_PRODUCTS.map(templateDDemoToProduct);
}

export async function getTemplateDProduct(productId: string): Promise<Product | null> {
  if (isLiveStorefrontCatalog()) return getLiveProduct(productId);
  const demo = getTemplateDDemoProduct(productId);
  return demo ? templateDDemoToProduct(demo) : null;
}

export async function getTemplateDProductPage(productId: string): Promise<{
  product: Product;
  faqs: StoreFaq[];
} | null> {
  const product = await getTemplateDProduct(productId);
  if (!product) return null;
  const faqs = isLiveStorefrontCatalog() ? await getLiveSellerFaqs() : TEMPLATE_D_DEMO_FAQS;
  return { product, faqs };
}
