"use client";

import { useParams } from "next/navigation";
import { KitchenwareCartView } from "@/app/store/kitchenware-template/cart-view";

export default function KitchenwareSellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return (
    <KitchenwareCartView storeSlug={slug} shopHref={`/store/kitchenware-template/${slug}`} />
  );
}
