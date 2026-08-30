"use client";

import { useParams } from "next/navigation";
import { TemplateDCartView } from "@/app/store/template-d/cart-view";

export default function TemplateDSellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <TemplateDCartView storeSlug={slug} shopHref={`/store/template-d/${slug}`} />;
}
