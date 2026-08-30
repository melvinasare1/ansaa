"use client";

import { useParams } from "next/navigation";
import { TemplateBCartView } from "@/app/store/template-b/cart-view";

export default function TemplateBSellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <TemplateBCartView storeSlug={slug} shopHref={`/store/template-b/${slug}`} />;
}
