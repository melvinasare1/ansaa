import { Suspense } from "react";
import {
  getKitchenwareSearchFacets,
  listKitchenwareSearchProducts,
} from "@/components/store/kitchenware-template/catalog";
import { KITCHENWARE_TEMPLATE_BASE } from "@/components/store/kitchenware-template/demo-catalog";
import {
  KitchenwareSearchCatalog,
  KitchenwareSearchSkeleton,
} from "@/components/store/kitchenware-template/search-catalog";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";

export default async function KitchenwareTemplateSearchPage() {
  const base = KITCHENWARE_TEMPLATE_BASE;
  const products = await listKitchenwareSearchProducts();
  const facets = await getKitchenwareSearchFacets(products);

  return (
    <div>
      <StorefrontTracker storeSlug="kitchenware-template" path={`${base}/search`} />
      <Suspense fallback={<KitchenwareSearchSkeleton />}>
        <KitchenwareSearchCatalog products={products} facets={facets} productBase={base} />
      </Suspense>
    </div>
  );
}
