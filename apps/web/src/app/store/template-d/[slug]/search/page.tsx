import { TemplateDSearchView } from "@/app/store/template-d/search-view";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function TemplateDSellerSearchPage({
  params,
}: {
  params: { slug: string };
}) {
  await requireSellerForTemplate(params.slug, "template-d");
  return <TemplateDSearchView storeSlug={params.slug} />;
}
