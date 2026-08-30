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
  TEMPLATE_D_DEMO_FAQS,
  TEMPLATE_D_DEMO_PRODUCTS,
  getTemplateDDemoProduct,
  templateDDemoToProduct,
} from "@/components/store/template-d/demo-catalog";

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

export async function listTemplateDProducts(storeSlug?: string): Promise<Product[]> {
  if (storeSlug) return listProductsForStoreSlug(storeSlug);
  if (isLiveStorefrontCatalog()) return listLiveProducts();
  return TEMPLATE_D_DEMO_PRODUCTS.map(templateDDemoToProduct);
}

export async function getTemplateDProduct(
  productId: string,
  storeSlug?: string
): Promise<Product | null> {
  if (storeSlug) return getProductForStoreSlug(storeSlug, productId);
  if (isLiveStorefrontCatalog()) return getLiveProduct(productId);
  const demo = getTemplateDDemoProduct(productId);
  return demo ? templateDDemoToProduct(demo) : null;
}

export async function getTemplateDProductPage(
  productId: string,
  storeSlug?: string
): Promise<{
  product: Product;
  faqs: StoreFaq[];
} | null> {
  const product = await getTemplateDProduct(productId, storeSlug);
  if (!product) return null;
  const faqs = storeSlug
    ? await getSellerFaqsForStoreSlug(storeSlug)
    : isLiveStorefrontCatalog()
      ? await getLiveSellerFaqs()
      : TEMPLATE_D_DEMO_FAQS;
  return { product, faqs };
}

export async function listTemplateDSearchProducts(
  storeSlug?: string
): Promise<CatalogSearchProduct[]> {
  return (await listTemplateDProducts(storeSlug)).map(toSearchProduct);
}
