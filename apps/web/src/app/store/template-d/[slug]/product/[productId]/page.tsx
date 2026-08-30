import { TemplateDProductView } from "@/app/store/template-d/product-view";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function TemplateDSellerProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  await requireSellerForTemplate(params.slug, "template-d");
  return <TemplateDProductView productId={params.productId} storeSlug={params.slug} />;
}
