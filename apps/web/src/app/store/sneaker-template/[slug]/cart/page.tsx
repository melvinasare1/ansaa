"use client";

import { useParams } from "next/navigation";
import { SneakerCartView } from "@/app/store/sneaker-template/cart-view";

export default function SneakerSellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <SneakerCartView storeSlug={slug} shopHref={`/store/sneaker-template/${slug}`} />;
}
