"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/store/hair-beauty-template/Header";

/**
 * Matches CrownedGH site-chrome: home has no sticky header (hero owns nav).
 * Search/cart/product/contact keep the sticky Header.
 */
export function HairBeautyChrome({
  children,
  base,
  brandName,
  logoUrl,
  footer,
}: {
  children: React.ReactNode;
  base: string;
  brandName: string;
  logoUrl?: string;
  footer: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const rest = pathname.slice(base.length).replace(/^\//, "");
  const first = rest.split("/")[0] ?? "";
  const isHome = first === "" || first === undefined;

  return (
    <>
      {isHome ? null : <Header base={base} brandName={brandName} logoUrl={logoUrl} />}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
