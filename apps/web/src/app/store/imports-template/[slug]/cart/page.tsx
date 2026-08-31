"use client";

import { useParams } from "next/navigation";
import { ImportsCartView } from "@/app/store/imports-template/cart-view";

export default function ImportsSellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <ImportsCartView storeSlug={slug} shopHref={`/store/imports-template/${slug}`} />;
}
