"use client";

import { usePathname } from "next/navigation";
import { NotFoundView } from "@/components/NotFoundView";

export function StoreNotFoundView() {
  const pathname = usePathname();
  const match = pathname.match(/^(\/store\/template-[a-d]\/[^/]+)/);
  return <NotFoundView homeHref={match?.[1] ?? "/"} />;
}
