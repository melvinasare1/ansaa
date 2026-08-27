// Template B — "Market": a dense, flyer-like catalog grid for sellers moving higher
// volumes of general goods (electronics accessories, home goods) where price and
// availability matter more than editorial photography.
import { Archivo } from "next/font/google";

const condensed = Archivo({ subsets: ["latin"], variable: "--font-market", weight: ["600", "800"] });

export default function TemplateBLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <div className={`${condensed.variable} min-h-screen bg-white text-[#0B1220]`}>
      <header className="sticky top-0 z-10 border-b-2 border-[#0B1220] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="font-[family-name:var(--font-market)] text-lg font-extrabold uppercase tracking-tight">
            {params.slug}
          </span>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <a href="#" className="hover:text-[#1447E6]">
              All items
            </a>
            <a
              href={`/store/template-b/${params.slug}/cart`}
              className="rounded bg-[#1447E6] px-4 py-1.5 text-white"
            >
              Cart
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="border-t-2 border-[#0B1220] py-8 text-center text-xs font-semibold uppercase tracking-wide text-[#0B1220]/50">
        Fulfilled by Fulfil
      </footer>
    </div>
  );
}
