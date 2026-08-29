import type { Product, StoreFaq } from "@ansaa/shared/types";
import {
  getLiveProduct,
  getLiveSellerFaqs,
  isLiveStorefrontCatalog,
  listLiveProducts,
} from "@/lib/live-catalog";
import {
  TEMPLATE_A_DEMO_FAQS,
  TEMPLATE_A_DEMO_PRODUCTS,
  getTemplateADemoProduct,
  templateADemoToProduct,
} from "@/components/store/template-a/demo-catalog";

export async function listTemplateAProducts(): Promise<Product[]> {
  if (isLiveStorefrontCatalog()) return listLiveProducts();
  return TEMPLATE_A_DEMO_PRODUCTS.map(templateADemoToProduct);
}

export async function getTemplateAProduct(productId: string): Promise<Product | null> {
  if (isLiveStorefrontCatalog()) return getLiveProduct(productId);
  const demo = getTemplateADemoProduct(productId);
  return demo ? templateADemoToProduct(demo) : null;
}

export async function getTemplateAProductPage(productId: string): Promise<{
  product: Product;
  faqs: StoreFaq[];
} | null> {
  const product = await getTemplateAProduct(productId);
  if (!product) return null;
  const faqs = isLiveStorefrontCatalog() ? await getLiveSellerFaqs() : TEMPLATE_A_DEMO_FAQS;
  return { product, faqs };
}
