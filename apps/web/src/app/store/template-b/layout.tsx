// Template B — "Market": a dense, flyer-like catalog grid for sellers moving higher
// volumes of general goods (electronics accessories, home goods) where price and
// availability matter more than editorial photography.
import Link from "next/link";
import { Archivo } from "next/font/google";
import { CartLink } from "@/components/store/template-b/CartLink";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";
import { storefrontBase } from "@/lib/store-path";
import { sellerForStoreLayout } from "@/lib/storefront-resolve";

const condensed = Archivo({ subsets: ["latin"], variable: "--font-market", weight: ["600", "800"] });

export default async function TemplateBLayout({ children }: { children: React.ReactNode }) {
  const { storeSlug, seller } = await sellerForStoreLayout("template-b");
  const base = storefrontBase("template-b", storeSlug);
  const brandName = seller?.businessName || DEFAULT_STORE_NAME;

  return (
    <div className={`${condensed.variable} min-h-screen bg-white text-[#0B1220]`}>
      <header className="sticky top-0 z-10 border-b-2 border-[#0B1220] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href={base}
            className="font-[family-name:var(--font-market)] text-lg font-extrabold uppercase tracking-tight"
          >
            {brandName}
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href={base} className="hover:text-[#1447E6]">
              All items
            </Link>
            <Link href={`${base}/search`} className="hover:text-[#1447E6]">
              Search
            </Link>
            <CartLink href={`${base}/cart`} />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="border-t-2 border-[#0B1220] py-8 text-center text-xs font-semibold uppercase tracking-wide text-[#0B1220]/50">
        © {new Date().getFullYear()} {brandName}
      </footer>
    </div>
  );
}
