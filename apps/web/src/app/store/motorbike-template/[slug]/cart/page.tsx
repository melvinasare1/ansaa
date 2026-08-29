"use client";

import { useParams } from "next/navigation";
import { RideCartView } from "@/components/store/motorbike-template/cart-view";

export default function MotorbikeTemplateSellerCartPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <RideCartView storeSlug={slug} />;
}
