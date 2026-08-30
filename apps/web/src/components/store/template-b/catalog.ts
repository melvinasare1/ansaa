import type { Product, StoreFaq } from "@ansaa/shared/types";
import {
  getLiveProduct,
  getLiveSellerFaqs,
  getProductForStoreSlug,
  getSellerFaqsForStoreSlug,
  isLiveStorefrontCatalog,
  listLiveProducts,
  listProductsForStoreSlug,
} from "@/lib/live-catalog";
import type { CatalogSearchProduct } from "@/components/store/catalog-search-types";
import {
  TEMPLATE_B_DEMO_FAQS,
  TEMPLATE_B_DEMO_PRODUCTS,
  getTemplateBDemoProduct,
  templateBDemoToProduct,
} from "@/components/store/template-b/demo-catalog";

function toSearchProduct(product: Product): CatalogSearchProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceCedis: product.priceCedis,
    category: product.category,
    createdAt: product.createdAt,
    image: product.images[0] ?? "",
  };
}

export async function listTemplateBProducts(storeSlug?: string): Promise<Product[]> {
  if (storeSlug) return listProductsForStoreSlug(storeSlug);
  if (isLiveStorefrontCatalog()) return listLiveProducts();
  return TEMPLATE_B_DEMO_PRODUCTS.map(templateBDemoToProduct);
}

export async function getTemplateBProduct(
  productId: string,
  storeSlug?: string
): Promise<Product | null> {
  if (storeSlug) return getProductForStoreSlug(storeSlug, productId);
  if (isLiveStorefrontCatalog()) return getLiveProduct(productId);
  const demo = getTemplateBDemoProduct(productId);
  return demo ? templateBDemoToProduct(demo) : null;
}

export async function getTemplateBProductPage(
  productId: string,
  storeSlug?: string
): Promise<{
  product: Product;
  faqs: StoreFaq[];
} | null> {
  const product = await getTemplateBProduct(productId, storeSlug);
  if (!product) return null;
  const faqs = storeSlug
    ? await getSellerFaqsForStoreSlug(storeSlug)
    : isLiveStorefrontCatalog()
      ? await getLiveSellerFaqs()
      : TEMPLATE_B_DEMO_FAQS;
  return { product, faqs };
}

export async function listTemplateBSearchProducts(
  storeSlug?: string
): Promise<CatalogSearchProduct[]> {
  return (await listTemplateBProducts(storeSlug)).map(toSearchProduct);
}
