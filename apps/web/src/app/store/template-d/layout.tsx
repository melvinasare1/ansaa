// Template D — "STYLEHIVE": a minimal black-and-white streetwear/fashion
// storefront for apparel sellers. Sora display + Work Sans body; monochrome.
import Link from "next/link";
import { Sora, Work_Sans } from "next/font/google";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Menu,
  Search,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import { StoreSearchForm } from "@/components/store/StoreSearchForm";
import { CartFeedbackProvider } from "@/components/store/cart-feedback";
import { STYLEHIVE_CHROME } from "@/components/store/pdp/chrome";
import { CartLink } from "@/components/store/template-d/CartLink";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";
import { storefrontBase } from "@/lib/store-path";
import { sellerForStoreLayout } from "@/lib/storefront-resolve";

const footerLinkGroups = [
  { heading: "About", links: ["Company", "Leadership", "Press", "Careers"] },
  { heading: "Help", links: ["Support", "Shipping", "Returns", "Terms"] },
  { heading: "Menu", links: ["Home", "Shop", "About Us", "Contact"] },
  { heading: "Company", links: ["Privacy Policy", "Terms of Use", "FAQ"] },
];

const pillLinks = ["New Arrivals", "Sales", "Man", "Women", "Kid's", "Brand"];

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.8 19.2c.6-2.2 1-4.4.5-6.4-.4-1.6.5-2.7 1.8-2.7 1.2 0 1.8 1 1.8 2.3 0 2.9-1.7 4.8-1.7 4.8" />
      <path d="m10.4 9.8 1.2 7.4" />
    </svg>
  );
}

const display = Sora({
  subsets: ["latin"],
  variable: "--font-stylehive-display",
  weight: ["500", "600", "700", "800"],
});

const body = Work_Sans({
  subsets: ["latin"],
  variable: "--font-stylehive-body",
  weight: ["400", "500", "600"],
});

export default async function TemplateDLayout({ children }: { children: React.ReactNode }) {
  const { storeSlug, seller } = await sellerForStoreLayout("template-d");
  const base = storefrontBase("template-d", storeSlug);
  const brandName = seller?.businessName || DEFAULT_STORE_NAME;

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F5F5F3] text-black`}
      style={{ fontFamily: "var(--font-stylehive-body), ui-sans-serif, system-ui" }}
    >
      <CartFeedbackProvider toastClass={STYLEHIVE_CHROME.cartToastClass}>
      <header className="border-b border-black/5 bg-[#F5F5F3]">
        {/* Top row */}
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 md:px-8">
          <button type="button" aria-label="Open menu" className="justify-self-start p-1">
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <Link
            href={base}
            className="text-center text-[22px] font-extrabold uppercase tracking-[0.12em] md:text-[26px]"
            style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
          >
            {brandName}
          </Link>

          <div className="flex items-center justify-end gap-5">
            <nav className="hidden items-center gap-5 text-[13px] font-medium text-black/80 md:flex">
              <a href="#about">About Us</a>
              <a href="#blog">Blog</a>
              <a href="#faq">FAQ</a>
            </nav>
            <button type="button" aria-label="Account" className="p-1">
              <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
            <CartLink href={`${base}/cart`} />
          </div>
        </div>

        {/* Second row */}
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 pb-4 md:gap-4 md:px-8">
          <div className="relative w-[140px] shrink-0 sm:w-[180px] md:w-[220px]">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-black/40"
              strokeWidth={1.75}
            />
            <StoreSearchForm
              action={`${base}/search`}
              placeholder="Search Cloth"
              inputClassName="h-10 w-full rounded-full border border-black/10 bg-white py-2 pl-10 pr-4 text-sm text-black outline-none placeholder:text-black/40"
            />
          </div>

          <label className="relative shrink-0">
            <span className="sr-only">Category</span>
            <select
              defaultValue="clothing"
              className="h-10 appearance-none rounded-full border border-black/10 bg-white py-2 pl-4 pr-9 text-sm font-medium outline-none"
            >
              <option value="clothing">Clothing</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/50"
              strokeWidth={2}
            />
          </label>

          <nav className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {pillLinks.map((label) => (
              <a
                key={label}
                href="#shop"
                className="shrink-0 rounded-full bg-white px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-black shadow-[0_0_0_1px_rgba(0,0,0,0.04)] md:px-4 md:text-[12px]"
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#shop"
            className="shrink-0 text-[13px] font-semibold uppercase tracking-wide"
          >
            Shopping
          </a>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-[#111111] text-white">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))] lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <p
                className="text-[20px] font-extrabold uppercase tracking-[0.12em] md:text-[22px]"
                style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
              >
                {brandName}
              </p>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/45">
                Seamless transactions, personalized insights, and innovative solutions for a
                smarter tomorrow.
              </p>
              <div className="mt-6 flex items-center gap-3 text-white/55">
                <a href="#" aria-label="Facebook" className="transition-colors hover:text-white">
                  <Facebook className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="YouTube" className="transition-colors hover:text-white">
                  <Youtube className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="Pinterest" className="transition-colors hover:text-white">
                  <PinterestIcon className="h-4 w-4" />
                </a>
                <a href="#" aria-label="Instagram" className="transition-colors hover:text-white">
                  <Instagram className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="Twitter" className="transition-colors hover:text-white">
                  <Twitter className="h-4 w-4" strokeWidth={1.6} />
                </a>
              </div>
            </div>

            {footerLinkGroups.map((group) => (
              <div key={group.heading} id={group.heading === "About" ? "about" : undefined}>
                <p
                  className="text-[14px] font-semibold text-white"
                  style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
                >
                  {group.heading}
                </p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-white/45">
                  {group.links.map((label) => (
                    <li key={label}>
                      <a href="#" className="transition-colors hover:text-white/80">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-white/40 md:flex-row md:items-center md:justify-between">
            <p>
              Copyright © 2026 {brandName}. All Rights Reserved.{" "}
              <a
                href="https://ansaagh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-white/70 hover:underline"
              >
                Powered by Ansaa
              </a>
            </p>
            <a href="#" className="transition-colors hover:text-white/70">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
      </CartFeedbackProvider>
    </div>
  );
}
