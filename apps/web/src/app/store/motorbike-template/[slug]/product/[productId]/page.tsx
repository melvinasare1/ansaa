import { RideProductPage } from "@/components/store/motorbike-template/product-page";

export default async function MotorbikeTemplateSlugProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  return (
    <RideProductPage
      productId={params.productId}
      storeSlug={params.slug}
      pathBase={`/store/motorbike-template/${params.slug}`}
    />
  );
}
