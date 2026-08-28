import Link from "next/link";
import Header from "@/components/marketing/Header";
import { marketingNav } from "@/components/marketing/nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <footer className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold">Fulfil</p>
              <p className="mt-2 max-w-xs text-sm text-white/70">
                Storefront first. Fulfilment if you want it.
              </p>
            </div>
            <div className="flex flex-col gap-6 sm:items-end">
              <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
                {marketingNav.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-navy transition hover:bg-white/90"
              >
                Join the list
              </Link>
            </div>
          </div>
          <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
            © {new Date().getFullYear()} Fulfil
          </p>
        </div>
      </footer>
    </>
  );
}
