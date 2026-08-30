import { RideProductPage } from "@/components/store/motorbike-template/product-page";
import { requireSellerForTemplate } from "@/lib/storefront-resolve";

export default async function MotorbikeTemplateSlugProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  await requireSellerForTemplate(params.slug, "motorbike-template");
  return (
    <RideProductPage
      productId={params.productId}
      storeSlug={params.slug}
      pathBase={`/store/motorbike-template/${params.slug}`}
    />
  );
}
