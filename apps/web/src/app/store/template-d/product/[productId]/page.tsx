import { TemplateDProductView } from "../../product-view";

export default async function TemplateDProductPage({
  params,
}: {
  params: { productId: string };
}) {
  return <TemplateDProductView productId={params.productId} />;
}
