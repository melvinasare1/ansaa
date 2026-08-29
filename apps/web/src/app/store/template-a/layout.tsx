// Template A — "Styleco": a general clothing/apparel catalog with sidebar filters
// for fashion sellers. Plus Jakarta Sans + black/white with a warm orange accent.
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { User } from "lucide-react";
import { CartIconLink } from "@/components/store/template-a/CartIconLink";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-styleco",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const navLinks = ["Shop", "Women", "Men", "Children"] as const;
const base = "/store/template-a";

export default function TemplateALayout({ children }: { children: React.ReactNode }) {
  const brandName = DEFAULT_STORE_NAME;

  return (
    <div
      className={`${sans.variable} min-h-screen bg-white text-black`}
      style={{ fontFamily: "var(--font-styleco), ui-sans-serif, system-ui" }}
    >
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-5 px-5 py-4 md:gap-8 md:px-8">
          <Link
            href={base}
            className="shrink-0 text-[22px] font-extrabold italic leading-none tracking-tight md:text-[26px]"
          >
            {brandName}
          </Link>

          <nav className="hidden items-center gap-6 text-[15px] font-medium text-black md:flex">
            {navLinks.map((label) => (
              <a key={label} href={`${base}#catalog`} className="transition-opacity hover:opacity-60">
                {label}
              </a>
            ))}
          </nav>

          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              placeholder="Search"
              className="h-11 w-full rounded-full bg-[#EFEFEF] px-5 text-sm text-black outline-none placeholder:text-black/35"
            />
          </label>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Account"
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 text-white"
            >
              <User className="h-6 w-6 translate-y-0.5" strokeWidth={1.6} />
            </button>
            <CartIconLink href={`${base}/cart`} />
          </div>
        </div>
        <nav className="flex items-center gap-5 overflow-x-auto px-5 pb-3 text-[14px] font-medium text-black md:hidden md:px-8">
          {navLinks.map((label) => (
            <a key={label} href={`${base}#catalog`} className="shrink-0">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 [&:has(#catalog)]:max-w-none [&:has(#catalog)]:p-0">
        {children}
      </main>
    </div>
  );
}
