import { Suspense } from "react";
import { listTemplateDSearchProducts } from "@/components/store/template-d/catalog";
import { CatalogSearch, CatalogSearchSkeleton } from "@/components/store/catalog-search";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { storefrontBase } from "@/lib/store-path";

export async function TemplateDSearchView({ storeSlug }: { storeSlug?: string } = {}) {
  const base = storefrontBase("template-d", storeSlug);
  const products = await listTemplateDSearchProducts(storeSlug);

  return (
    <div>
      <StorefrontTracker storeSlug={storeSlug ?? "template-d"} path={`${base}/search`} />
      <Suspense fallback={<CatalogSearchSkeleton theme="stylehive" />}>
        <CatalogSearch products={products} productBase={base} theme="stylehive" />
      </Suspense>
    </div>
  );
}
