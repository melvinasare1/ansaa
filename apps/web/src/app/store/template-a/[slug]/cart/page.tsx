"use client";

import { useParams } from "next/navigation";
import { TemplateACartView } from "@/app/store/template-a/cart-view";

export default function TemplateASellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <TemplateACartView storeSlug={slug} shopHref={`/store/template-a/${slug}`} />;
}
