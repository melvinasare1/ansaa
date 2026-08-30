import { TemplateBSearchView } from "@/app/store/template-b/search-view";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function TemplateBSellerSearchPage({
  params,
}: {
  params: { slug: string };
}) {
  await requireSellerForTemplate(params.slug, "template-b");
  return <TemplateBSearchView storeSlug={params.slug} />;
}
