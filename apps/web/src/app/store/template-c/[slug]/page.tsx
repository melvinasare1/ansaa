import Image from "next/image";
import { ArrowRight, Github, Globe, Instagram, Leaf, Linkedin, Quote, Sprout, Twitter } from "lucide-react";
import ProductCarousel, {
  type KitchenProduct,
} from "@/components/store/template-c/ProductCarousel";
import CategoryCarousel, {
  type KitchenCategory,
} from "@/components/store/template-c/CategoryCarousel";
import GalleryCarousel, {
  type GalleryPiece,
} from "@/components/store/template-c/GalleryCarousel";

// TODO: fetch products from Firestore where sellerId == seller resolved from slug/domain
const mockProducts: KitchenProduct[] = [
  {
    id: "p1",
    name: "Reusable drinkware for a greener lifestyle.",
    price: "GHS 43.85",
    badge: "Promotion",
    colors: ["#7BA3C9", "#3D6B4F", "#9AA0A6"],
    image: "/template-c/bottle.jpg",
    imageAlt: "Matte green reusable water bottle",
  },
  {
    id: "p2",
    name: "Enamel cookware set for everyday meals.",
    price: "GHS 128.00",
    badge: "New",
    colors: ["#E8A54B", "#C45C26", "#2B4239"],
    image: "/template-c/pots.jpg",
    imageAlt: "Stacked enamel pots on a kitchen counter",
  },
  {
    id: "p3",
    name: "Electric kettle in recycled steel.",
    price: "GHS 89.50",
    badge: "Customer favorite",
    colors: ["#3D6B4F", "#D7C7A2", "#2B4239"],
    image: "/template-c/kettle.jpg",
    imageAlt: "Green electric kettle",
  },
  {
    id: "p4",
    name: "Utensil crock for a clutter-free counter.",
    price: "GHS 36.00",
    badge: "Promotion",
    colors: ["#E8C547", "#F5F1E4", "#2B4239"],
    image: "/template-c/utensils.jpg",
    imageAlt: "Kitchen utensils in a ceramic holder",
  },
  {
    id: "p5",
    name: "Bamboo serving boards, two-piece set.",
    price: "GHS 54.00",
    badge: "New",
    colors: ["#C4A574", "#2B4239", "#EDE8DC"],
    image: "/template-c/boards.jpg",
    imageAlt: "Bamboo cutting and serving boards",
  },
  {
    id: "p6",
    name: "Stoneware bowls for slow weekend cooking.",
    price: "GHS 62.00",
    badge: "Customer favorite",
    colors: ["#8B9A8C", "#D4C4A8", "#2B4239"],
    image: "/template-c/bowls.jpg",
    imageAlt: "Stacked ceramic bowls",
  },
];

const mockCategories: KitchenCategory[] = [
  {
    id: "c1",
    name: "CupEco",
    image: "/template-c/cups.jpg",
    imageAlt: "Stacked ceramic cups",
  },
  {
    id: "c2",
    name: "EcoSpoonery",
    image: "/template-c/pots.jpg",
    imageAlt: "Wooden spoons and utensils",
  },
  {
    id: "c3",
    name: "NatureSip",
    image: "/template-c/bottle.jpg",
    imageAlt: "Glass drinkware",
  },
  {
    id: "c4",
    name: "FreshPitcher",
    image: "/template-c/kettle.jpg",
    imageAlt: "Ceramic pitcher",
  },
  {
    id: "c5",
    name: "GroveBoard",
    image: "/template-c/bowls.jpg",
    imageAlt: "Wooden serving boards",
  },
];

const mockGallery: GalleryPiece[] = [
  { id: "g1", name: "SizzlePro Non-Stick Pan", image: "/template-c/pots.jpg" },
  { id: "g2", name: "Grove Serving Board", image: "/template-c/bowls.jpg" },
  { id: "g3", name: "StirWell Utensil Set", image: "/template-c/utensils.jpg" },
  { id: "g4", name: "CupEco Stoneware Mug", image: "/template-c/cups.jpg" },
  { id: "g5", name: "NatureSip Carafe", image: "/template-c/bottle.jpg" },
  { id: "g6", name: "Forest Kettle", image: "/template-c/kettle.jpg" },
];

const mockReviews = [
  {
    quote:
      "The casserole replaced three pans in my cupboard. Even heat, and it still looks new after months of weeknight stews.",
    name: "Ama Boateng",
    title: "Home cook, Accra",
  },
  {
    quote:
      "Packed and photographed before it left — arrived unchipped, exactly as shown. That kind of care is rare.",
    name: "Kojo Mensah",
    title: "Apartment kitchen, Kumasi",
  },
  {
    quote:
      "Quiet cooker, a lid that seals, and handsome enough to stay on the table. We reach for it every Sunday.",
    name: "Efua Darko",
    title: "Family kitchen, Tema",
  },
];

export default function TemplateCHome({ params }: { params: { slug: string } }) {
  return (
    <div>
      <section className="relative min-h-[92vh] overflow-hidden bg-[#1F3830]">
        {/* Real seller photography goes here — this Unsplash kitchen still is a
            stand-in until the seller uploads their own warm kitchen shots. The
            #1F3830 forest field underneath is the fallback if photography is missing. */}
        <Image
          src="/template-c/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142822]/55 via-[#142822]/25 to-transparent" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-center px-6 pb-24 pt-28 md:px-10">
          <h1
            className="max-w-xl text-[48px] font-medium leading-[1.08] text-white md:text-[64px]"
            style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
          >
            Eco-Friendly{" "}
            <em className="italic font-normal">Kitchenware</em>
            <br />
            for a greener home
          </h1>
          <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/90">
            Thoughtfully made tools for everyday cooking — durable materials, low-waste
            design, and pieces you&apos;ll keep for years, not a single season.
          </p>
          <a
            href="#shop"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#F5F1E4] px-6 py-2.5 text-sm font-medium text-[#2B4239]"
          >
            Shop now
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>

        <aside className="absolute bottom-8 right-6 z-10 w-[200px] rounded-md bg-[#2B4239]/55 px-4 py-3 text-white backdrop-blur-sm md:right-10">
          <p className="text-[10px] leading-snug tracking-wide text-white/85">
            Natural, Sustainable, Eco-conscious
          </p>
          <div className="mt-1 flex items-end justify-between">
            <span
              className="text-[42px] font-medium leading-none"
              style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
            >
              96%
            </span>
            <Leaf className="mb-1 h-6 w-6 text-[#F5F1E4]" strokeWidth={1.4} />
          </div>
        </aside>
      </section>

      <section id="shop" className="bg-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[13px] font-medium text-[#2B4239]">
                Eco Essentials Planet-Friendly
              </p>
              <h2
                className="mt-1 text-[34px] leading-none text-[#2B4239] md:text-[40px]"
                style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
              >
                <em className="italic font-normal">Bestselling</em>
                <span className="mx-2 inline-block text-[18px] not-italic" aria-hidden>
                  ✧
                </span>
                <span className="font-semibold">Products</span>
              </h2>
            </div>
            <a
              href={`/store/template-c/${params.slug}#shop`}
              className="mb-1 inline-flex items-center gap-1.5 text-sm text-[#2B4239]"
            >
              More products
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>

          <ProductCarousel products={mockProducts} />
        </div>
      </section>

      <section className="relative">
        <div className="relative min-h-[420px] overflow-hidden bg-[#3D5348] md:min-h-[520px]">
          {/* Real lifestyle photography goes here — this kitchen still is a
              stand-in until the seller uploads their own editorial shots. The
              sage/olive #3D5348 field underneath is the fallback. */}
          <Image
            src="/template-c/editorial.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142822]/55 via-transparent to-transparent" />
          <blockquote
            className="absolute bottom-16 left-6 max-w-xl text-[22px] font-medium leading-snug text-white md:bottom-24 md:left-10 md:text-[28px]"
            style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
          >
            We craft <em className="italic font-normal">kitchenware</em> you can trust
            for years to come — through everyday meals and{" "}
            <em className="italic font-normal">evolving lifestyles</em>. Each piece is
            thoughtfully made with{" "}
            <em className="italic font-normal">sustainable materials</em>
          </blockquote>
        </div>

        <div className="relative z-10 mx-auto -mt-8 flex max-w-[1400px] flex-col items-stretch justify-center gap-3 px-6 sm:flex-row sm:items-center md:-mt-10 md:gap-4 md:px-10">
          {[
            { kicker: "Natural", label: "Finish", Icon: Leaf },
            { kicker: "Eco", label: "Innovation", Icon: Globe },
            { kicker: "Sustainable", label: "Materials", Icon: Sprout },
          ].map(({ kicker, label, Icon }) => (
            <div
              key={label}
              className="flex flex-1 items-center gap-3 rounded-full bg-[#F5F1E4] px-4 py-3 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2B4239] text-[#F5F1E4]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </span>
              <span className="leading-tight">
                <span
                  className="block text-[13px] italic text-[#2B4239]"
                  style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
                >
                  {kicker}
                </span>
                <span className="block text-sm font-semibold tracking-wide text-[#2B4239]">
                  {label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white pb-8 pt-16 md:pt-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h2
            className="mb-10 max-w-2xl text-[32px] font-medium leading-tight text-[#2B4239] md:text-[40px]"
            style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
          >
            Explore our thoughtful and planet-first Categories
          </h2>
          <CategoryCarousel categories={mockCategories} />
        </div>
      </section>

      <section id="bestsellers" className="bg-white pt-16 md:pt-24">
        <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="md:pt-6">
            <h2 className="text-[40px] font-medium leading-none text-[#2B4239] md:text-[52px]">
              Best{" "}
              <em
                className="italic font-normal"
                style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
              >
                sellers
              </em>
            </h2>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-[#2B4239]/50">
              The enamel casserole everyone keeps coming back for — even heat, a lid that
              actually seals, and a pot handsome enough to go from hob to table without a
              second dish.
            </p>
            <a
              href="#shop"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#2B4239] px-5 py-2 text-sm font-medium text-[#F5F1E4]"
            >
              Shop now
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDE8DC]">
            <Image
              src="/template-c/bestsellers.jpg"
              alt="Rice cookers and everyday pots"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDE8DC] md:order-1">
            <Image
              src="/template-c/new-arrival-photo.jpg"
              alt="Dark-toned cookware on a set table"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2 md:pt-6">
            <h2 className="text-[40px] font-medium leading-none text-[#2B4239] md:text-[52px]">
              New{" "}
              <em
                className="italic font-normal"
                style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
              >
                Arrival
              </em>
            </h2>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-[#2B4239]/50">
              A quieter cooker for slower evenings: recycled steel, a matte forest finish,
              and a footprint that leaves room on the counter for the rest of dinner.
            </p>
            <a
              href="#shop"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#2B4239] px-5 py-2 text-sm font-medium text-[#F5F1E4]"
            >
              Shop now
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <GalleryCarousel pieces={mockGallery} />
        </div>
      </section>

      <section className="bg-[#F5F1E4] py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-12">
            <p
              className="text-[56px] font-medium leading-none text-[#2B4239] md:text-[72px]"
              style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
            >
              4.9/5
            </p>
            <p className="mt-2 text-sm text-[#2B4239]/60">25,000 5-Star Reviews</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {mockReviews.map((r) => (
              <article key={r.name} className="rounded-2xl bg-white p-6 md:p-8">
                <Quote className="h-8 w-8 text-[#8B6B4A]" strokeWidth={1.25} />
                <p className="mt-5 text-[14px] leading-relaxed text-[#2B4239]/70">{r.quote}</p>
                <p
                  className="mt-8 text-[15px] text-[#2B4239]"
                  style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
                >
                  {r.name}
                </p>
                <p className="text-xs text-[#2B4239]/45">{r.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-16 md:py-24">
        <div className="relative mx-auto mb-14 h-[280px] max-w-3xl md:h-[340px]">
          <div className="absolute left-[4%] top-6 w-[38%] overflow-hidden rounded-2xl md:w-[34%]">
            <div className="relative aspect-[4/5]">
              <Image src="/template-c/editorial.jpg" alt="" fill className="object-cover" sizes="34vw" />
            </div>
          </div>
          <div className="absolute left-1/2 top-0 z-10 w-[42%] -translate-x-1/2 overflow-hidden rounded-2xl shadow-lg md:w-[38%]">
            <div className="relative aspect-[4/5]">
              <Image src="/template-c/pots.jpg" alt="" fill className="object-cover" sizes="38vw" />
            </div>
          </div>
          <div className="absolute right-[4%] top-10 w-[38%] overflow-hidden rounded-2xl md:w-[34%]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/template-c/new-arrival-photo.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="34vw"
              />
            </div>
          </div>
        </div>
        <p
          className="mx-auto max-w-3xl px-6 text-center text-[20px] font-medium leading-snug text-[#2B4239] md:text-[26px]"
          style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
        >
          Discover our commitment to{" "}
          <span className="relative inline-flex h-7 w-7 align-middle overflow-hidden rounded-full md:h-8 md:w-8">
            <Image src="/template-c/bottle.jpg" alt="" fill className="object-cover" sizes="32px" />
          </span>{" "}
          <em className="italic font-normal">sustainable</em> materials, low-impact production, and{" "}
          <em className="italic font-normal">ethical sourcing</em> partnerships — all crafted to
          support a healthier planet and a{" "}
          <span className="relative inline-flex h-7 w-7 align-middle overflow-hidden rounded-full md:h-8 md:w-8">
            <Image src="/template-c/cups.jpg" alt="" fill className="object-cover" sizes="32px" />
          </span>{" "}
          <em className="italic font-normal">greener kitchen</em>.
        </p>
      </section>

      <footer className="bg-white px-6 pb-10 pt-16 md:px-10 md:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2B4239]" aria-hidden>
                  <span className="flex h-3.5 w-3.5 flex-col justify-between">
                    <span className="h-[2px] w-full origin-left -rotate-[18deg] bg-[#F5F1E4]" />
                    <span className="h-[2px] w-full origin-left -rotate-[18deg] bg-[#F5F1E4]" />
                    <span className="h-[2px] w-full origin-left -rotate-[18deg] bg-[#F5F1E4]" />
                  </span>
                </span>
                <span
                  className="text-[22px] font-medium leading-none text-[#2B4239]"
                  style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
                >
                  Homedine
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#2B4239]/60">
                Homedine makes planet-kind kitchenware for everyday cooking — durable pieces that
                are easier to keep, share, and cook with for years, not a single season.
              </p>
              <div className="mt-5 flex items-center gap-4 text-[#2B4239]">
                <a href="#" aria-label="X">
                  <Twitter className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" strokeWidth={1.6} />
                </a>
                <a href="#" aria-label="GitHub">
                  <Github className="h-4 w-4" strokeWidth={1.6} />
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#2B4239]">Shop</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#2B4239]/65">
                <li>
                  <a href="#shop">Drinkware</a>
                </li>
                <li>
                  <a href="#shop">Cookware</a>
                </li>
                <li>
                  <a href="#shop">Utensils</a>
                </li>
                <li>
                  <a href="#shop">Serveware</a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2B4239]">Explore</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#2B4239]/65">
                <li>
                  <a href="#bestsellers">Bestsellers</a>
                </li>
                <li>
                  <a href="#gallery">Gallery</a>
                </li>
                <li>
                  <a href="#about">Our story</a>
                </li>
                <li>
                  <a href="#shop">New arrivals</a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2B4239]">Company</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#2B4239]/65">
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Partners</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#2B4239]/12 pt-6 text-sm text-[#2B4239]/55 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Homedine. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#" className="underline underline-offset-4">
                Privacy Policy
              </a>
              <a href="#" className="underline underline-offset-4">
                Terms of Service
              </a>
              <a href="#" className="underline underline-offset-4">
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
