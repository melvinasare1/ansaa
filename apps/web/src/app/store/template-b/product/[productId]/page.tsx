import { TemplateBProductView } from "../../product-view";

export default async function TemplateBProductPage({
  params,
}: {
  params: { productId: string };
}) {
  return <TemplateBProductView productId={params.productId} />;
}
