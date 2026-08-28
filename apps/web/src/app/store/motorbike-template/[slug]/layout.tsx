// Motorbike template — "Ride": a dark vehicle-retail storefront for sellers of
// motorbikes, bicycles, mopeds, and scooters. Outfit display + Public Sans body;
// near-black / cream / orange.
import Link from "next/link";
import { Outfit, Public_Sans } from "next/font/google";
import { Search, User } from "lucide-react";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";
import { getSellerByStoreSlug } from "@/lib/storefront";
import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-ride-display",
  weight: ["500", "600", "700", "800"],
});

const body = Public_Sans({
  subsets: ["latin"],
  variable: "--font-ride-body",
  weight: ["400", "500", "600"],
});

const navLinks = [
  { label: "Shop", href: "#shop" },
  { label: "Parts", href: "#accessories" },
  { label: "About Us", href: "#about" },
  { label: "Service & Repair", href: "#service" },
  { label: "Contact Us", href: "#contact" },
] as const;

function BikeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="7" cy="14.5" r="4.25" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="25" cy="14.5" r="4.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 14.5 13.5 6.5h7.5L25 14.5M13.5 6.5 16.5 14.5M11 14.5h5.5M16.2 6.5h4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M20.5 6.5h3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default async function MotorbikeTemplateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const base = `/store/motorbike-template/${params.slug}`;
  let brandName = "Ride";

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const seller = await getSellerByStoreSlug(supabase, params.slug);
    if (seller) {
      brandName = seller.businessName.trim() || DEFAULT_STORE_NAME;
    }
  }

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-white text-[#141414]`}
      style={{ fontFamily: "var(--font-ride-body), ui-sans-serif, system-ui" }}
    >
      <header className="bg-[#141414] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-4 md:gap-8 md:px-8">
          <Link href={base} className="flex shrink-0 items-center gap-2.5 text-white">
            <BikeMark className="h-5 w-8" />
            <span
              className="max-w-[180px] truncate text-[18px] font-extrabold uppercase leading-none tracking-[0.14em] md:max-w-[240px] md:text-[20px]"
              style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
            >
              {brandName}
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 text-[14px] font-medium text-white md:flex lg:gap-9">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="transition-opacity hover:opacity-70">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-4 md:ml-0">
            <button type="button" aria-label="Search" className="p-1 text-white">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Account" className="p-1 text-white">
              <User className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <nav className="flex items-center gap-5 overflow-x-auto px-5 pb-3 text-[13px] font-medium text-white md:hidden md:px-8">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href} className="shrink-0">
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-[#141414] text-white/45">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 text-[13px] md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 {brandName}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="transition-colors hover:text-white/80">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
