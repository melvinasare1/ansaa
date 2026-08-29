import { RideContactPage } from "@/components/store/motorbike-template/contact-page";

export default async function MotorbikeTemplateSellerContactPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <RideContactPage
      storeSlug={params.slug}
      path={`/store/motorbike-template/${params.slug}/contact`}
    />
  );
}
