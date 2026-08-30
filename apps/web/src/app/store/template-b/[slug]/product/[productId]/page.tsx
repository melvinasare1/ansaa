import { TemplateBProductView } from "@/app/store/template-b/product-view";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function TemplateBSellerProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  await requireSellerForTemplate(params.slug, "template-b");
  return <TemplateBProductView productId={params.productId} storeSlug={params.slug} />;
}
