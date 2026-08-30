import { TemplateBHome } from "@/app/store/template-b/home";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function TemplateBSellerHome({ params }: { params: { slug: string } }) {
  await requireSellerForTemplate(params.slug, "template-b");
  return <TemplateBHome storeSlug={params.slug} />;
}
