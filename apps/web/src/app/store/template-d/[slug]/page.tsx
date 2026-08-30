import { TemplateDHome } from "@/app/store/template-d/home";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function TemplateDSellerHome({ params }: { params: { slug: string } }) {
  await requireSellerForTemplate(params.slug, "template-d");
  return <TemplateDHome storeSlug={params.slug} />;
}
