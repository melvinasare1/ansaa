"use client";

import { useParams } from "next/navigation";
import { HairCartView } from "@/app/store/hair-beauty-template/cart-view";

export default function HairBeautySellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <HairCartView storeSlug={slug} shopHref={`/store/hair-beauty-template/${slug}`} />;
}
