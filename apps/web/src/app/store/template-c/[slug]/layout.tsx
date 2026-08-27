// Template C — "Homedine": a warm, editorial home/lifestyle storefront for
// kitchenware and houseware sellers. Serif display + forest/cream palette.
import Link from "next/link";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { Search, ShoppingBag, User } from "lucide-react";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-homedine-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-homedine-sans",
  weight: ["400", "500", "600"],
});

export default function TemplateCLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const base = `/store/template-c/${params.slug}`;

  return (
    <div
      className={`${display.variable} ${sans.variable} min-h-screen bg-white text-[#2B4239]`}
      style={{ fontFamily: "var(--font-homedine-sans), ui-sans-serif, system-ui" }}
    >
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6 py-6 md:px-10">
          <nav className="hidden items-center gap-7 text-[15px] font-medium text-white md:flex">
            <a href="#shop">Shop</a>
            <a href="#bestsellers">Bestsellers</a>
            <a href="#gallery">Gallery</a>
            <a href="#about">About</a>
          </nav>

          <Link
            href={base}
            className="text-center text-[28px] font-medium tracking-[0.04em] text-white md:text-[32px]"
            style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
          >
            Homedine
          </Link>

          <div className="flex items-center justify-end gap-3">
            <label className="relative hidden w-full max-w-[200px] md:block">
              <span className="sr-only">Search products</span>
              <input
                type="search"
                placeholder="Search Product..."
                className="h-10 w-full rounded-full border border-white/35 bg-white/15 px-4 pr-10 text-sm text-white placeholder:text-white/75 outline-none backdrop-blur-sm"
              />
              <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white" strokeWidth={1.75} />
            </label>
            <Link href={`${base}/cart`} aria-label="Cart" className="p-1 text-white">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </Link>
            <button
              type="button"
              aria-label="Account"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 text-white"
            >
              <User className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
