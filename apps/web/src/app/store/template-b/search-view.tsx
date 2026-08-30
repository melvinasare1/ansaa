import { Suspense } from "react";
import { listTemplateBSearchProducts } from "@/components/store/template-b/catalog";
import { CatalogSearch, CatalogSearchSkeleton } from "@/components/store/catalog-search";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { storefrontBase } from "@/lib/store-path";

export async function TemplateBSearchView({ storeSlug }: { storeSlug?: string } = {}) {
  const base = storefrontBase("template-b", storeSlug);
  const products = await listTemplateBSearchProducts(storeSlug);

  return (
    <div>
      <StorefrontTracker storeSlug={storeSlug ?? "template-b"} path={`${base}/search`} />
      <Suspense fallback={<CatalogSearchSkeleton theme="market" />}>
        <CatalogSearch products={products} productBase={base} theme="market" />
      </Suspense>
    </div>
  );
}
