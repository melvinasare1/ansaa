// Template A — "Styleco": a general clothing/apparel catalog with sidebar filters
// for fashion sellers. Plus Jakarta Sans + black/white with a warm orange accent.
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { User } from "lucide-react";
import { CartIconLink } from "@/components/store/template-a/CartIconLink";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-styleco",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const navLinks = ["Shop", "Women", "Men", "Children"] as const;

function sellerDisplayName(slug: string) {
  const name = slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return name || "Styleco";
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#EA4335" d="M3.6 2.2 13.7 12 3.6 21.8c-.4-.2-.6-.6-.6-1V3.2c0-.4.2-.8.6-1Z" />
      <path fill="#FBBC04" d="M16.9 8.8 13.7 12l3.2 3.2 4.3-2.5c.8-.4.8-1.6 0-2.1L16.9 8.8Z" />
      <path fill="#4285F4" d="M3.6 21.8 13.7 12l3.2 3.2-11.4 6.6c-.8.5-1.8-.1-1.9-1Z" />
      <path fill="#34A853" d="M16.9 8.8 5.5 2.2c.8-.5 1.8.1 1.9 1L13.7 12l3.2-3.2Z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.7 12.4c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-1-3-.9c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.2c1.1-1.5 1.5-3 1.5-3.1-.1 0-2.8-1.1-2.8-4.3ZM14.8 5.8c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z" />
    </svg>
  );
}

export default function TemplateALayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const storeName = sellerDisplayName(params.slug);
  const base = `/store/template-a/${params.slug}`;

  return (
    <div
      className={`${sans.variable} min-h-screen bg-white text-black`}
      style={{ fontFamily: "var(--font-styleco), ui-sans-serif, system-ui" }}
    >
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-2.5 md:px-8">
          <p className="min-w-0 truncate text-[13px] font-medium tracking-tight">
            Now you can shop in {storeName}&apos;s app, install now
          </p>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <a
              href="#"
              className="flex items-center gap-2 rounded-md border border-white/30 bg-neutral-950 px-2.5 py-1"
            >
              <PlayStoreIcon className="h-5 w-5" />
              <span className="leading-tight">
                <span className="block text-[8px] font-medium uppercase tracking-wide text-white/70">
                  Get it on
                </span>
                <span className="block text-[12px] font-semibold">Google Play</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-md border border-white/30 bg-neutral-950 px-2.5 py-1"
            >
              <AppleIcon className="h-5 w-5" />
              <span className="leading-tight">
                <span className="block text-[8px] font-medium tracking-wide text-white/70">
                  Download on the
                </span>
                <span className="block text-[12px] font-semibold">App Store</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-5 px-5 py-4 md:gap-8 md:px-8">
          <Link
            href={base}
            className="shrink-0 text-[22px] font-extrabold italic leading-none tracking-tight md:text-[26px]"
          >
            {storeName}.
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
