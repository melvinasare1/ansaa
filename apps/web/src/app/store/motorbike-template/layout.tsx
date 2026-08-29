// Motorbike template — "Ride": a dark vehicle-retail storefront for sellers of
// motorbikes, bicycles, mopeds, and scooters. Outfit display + Public Sans body;
// near-black / cream / orange.
import Link from "next/link";
import { Outfit, Public_Sans } from "next/font/google";
import { ArrowRight, Facebook, Instagram, Linkedin, Search, Twitter } from "lucide-react";
import { RideCartLink } from "@/components/store/motorbike-template/cart-link";
import { RideMobileNav } from "@/components/store/motorbike-template/mobile-nav";
import { DEFAULT_STORE_NAME } from "@/lib/store-name";

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

// Header only: Shop + Contact Us. Parts / About / Service sections stay on the
// homepage for now, but are not linked from the top nav.
const navLinks = [
  { label: "Shop", href: "/search" },
  { label: "Contact Us", href: "/contact" },
] as const;

const footerLinkGroups = [
  {
    heading: "Shop",
    links: [
      { label: "Motorbikes", href: "/search?category=motorbikes" },
      { label: "Bicycles", href: "/search?category=bicycles" },
      { label: "Mopeds", href: "/search?category=mopeds" },
      { label: "Scooters", href: "/search?category=scooters" },
      { label: "Accessories", href: "/search?category=accessories" },
    ],
  },
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

export default function MotorbikeTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = "/store/motorbike-template";
  const brandName = DEFAULT_STORE_NAME;
  const headerNav = navLinks.map((item) => ({
    label: item.label,
    href: `${base}${item.href}`,
  }));

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#FFFFFF] text-[#141414]`}
      style={{ fontFamily: "var(--font-ride-body), ui-sans-serif, system-ui" }}
    >
      <header className="relative bg-[#141414] text-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-5 md:gap-8 md:px-10">
          <Link href={base} className="flex shrink-0 items-center gap-2.5 text-white">
            <BikeMark className="h-[18px] w-[30px]" />
            <span
              className="max-w-[180px] truncate text-[17px] font-extrabold uppercase leading-none tracking-[0.18em] md:max-w-[240px] md:text-[19px]"
              style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
            >
              {brandName}
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 text-[14px] font-medium tracking-wide text-white/90 md:flex lg:gap-10">
            {headerNav.map((item) => (
              <Link key={item.label} href={item.href} className="transition-opacity hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-5 md:ml-0">
            <Link href={`${base}/search`} aria-label="Search" className="p-1 text-white">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <RideCartLink />
            <RideMobileNav links={headerNav} />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-[#141414] text-white">
        <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-8 md:px-10 md:pt-20">
          <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:gap-16 lg:gap-24">
            <div id="contact" className="max-w-md">
              <Link href={base} className="inline-flex items-center gap-2.5 text-white">
                <BikeMark className="h-[18px] w-[30px]" />
                <span
                  className="text-[17px] font-extrabold uppercase tracking-[0.18em]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {brandName}
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/45">
                Motorbikes, bicycles, mopeds, and scooters, sold, fitted, and serviced by
                people who ride.
              </p>
              <p
                className="mt-7 text-[13px] font-semibold"
                style={{ color: "#E8622C" }}
              >
                Signup for latest information
              </p>
              <form
                id="newsletter"
                action="#newsletter"
                className="mt-3 flex max-w-sm overflow-hidden rounded-lg border border-white/20"
              >
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex w-12 shrink-0 items-center justify-center text-white"
                  style={{ backgroundColor: "#E8622C" }}
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                </button>
              </form>
              <div className="mt-7 flex items-center gap-4 text-white/50">
                <a href="#" aria-label="Facebook" className="transition-colors hover:text-white">
                  <Facebook className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="Instagram" className="transition-colors hover:text-white">
                  <Instagram className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="Twitter" className="transition-colors hover:text-white">
                  <Twitter className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-white">
                  <Linkedin className="h-4 w-4" strokeWidth={1.6} />
                </a>
              </div>
            </div>

            {footerLinkGroups.map((group) => (
              <div key={group.heading} className="lg:w-44 lg:shrink-0">
                <p
                  className="text-[14px] font-semibold text-white"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {group.heading}
                </p>
                <ul className="mt-4 space-y-2.5 text-[13px] text-white/45">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <a href={`${base}${item.href}`} className="transition-colors hover:text-white/80">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-white/40 md:flex-row md:items-center md:justify-between">
            <p>© 2026 {brandName}. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#" className="transition-colors hover:text-white/70">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-white/70">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
