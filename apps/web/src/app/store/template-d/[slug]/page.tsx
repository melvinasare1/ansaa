import Image from "next/image";
import { ArrowRight, ArrowUpRight, BadgeCheck, Hexagon, Shield, Sparkles, Star } from "lucide-react";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";

const avatars = [
  { src: "/template-d/avatar-1.jpg", alt: "Customer review avatar" },
  { src: "/template-d/avatar-2.jpg", alt: "Customer review avatar" },
  { src: "/template-d/avatar-3.jpg", alt: "Customer review avatar" },
  { src: "/template-d/avatar-4.jpg", alt: "Customer review avatar" },
];

const partnerLogos = [
  { name: "Graphic", sub: "Studio", Icon: Hexagon },
  { name: "S. Salva", sub: "Art Director", Icon: BadgeCheck },
  { name: "Creative", sub: "Design", Icon: Star },
  { name: "Furniture", sub: "Design", Icon: Sparkles },
  { name: "Travel", sub: "Guidebook", Icon: Shield },
];

const categories = [
  { src: "/template-d/cat-set.jpg", label: "Set Collection", count: "35 items", alt: "Navy corduroy jacket over white hoodie" },
  { src: "/template-d/cat-shirt.jpg", label: "Shirt Outfit", count: "25 items", alt: "Olive corduroy shirt over white tee" },
  { src: "/template-d/cat-tee.jpg", label: "T-Shirt", count: "20 items", alt: "Neutral sweatshirts on hangers" },
];

const products = [
  { src: "/template-d/prod-1.jpg", alt: "Navy corduroy jacket over white hoodie" },
  { src: "/template-d/prod-2.jpg", alt: "Olive corduroy shirt over white tee" },
  { src: "/template-d/prod-3.jpg", alt: "Light denim jacket over white hoodie" },
  { src: "/template-d/prod-4.jpg", alt: "Cream corduroy shirt over white tee" },
  { src: "/template-d/prod-5.jpg", alt: "Grey overshirt product shot" },
  { src: "/template-d/prod-6.jpg", alt: "Black shirt product shot" },
];

const collections = [
  {
    src: "/template-d/hero-model.jpg",
    title: "Top Pants",
    alt: "Model in cargo pants and plaid outerwear",
  },
  {
    src: "/template-d/prod-3.jpg",
    title: "Full Set",
    alt: "Light denim jacket over white hoodie",
  },
  {
    src: "/template-d/card-corduroy.jpg",
    title: "Winter Collection",
    alt: "Cream corduroy jacket close-up",
  },
  {
    src: "/template-d/cat-shirt.jpg",
    title: "Top Shirt",
    alt: "Olive corduroy shirt over white tee",
  },
];

export default function TemplateDHome({ params }: { params: { slug: string } }) {
  return (
    <div className="pb-16 pt-6 md:pb-24 md:pt-8">
      <StorefrontTracker storeSlug={params.slug} path={`/store/template-d/${params.slug}`} />
      {/* Hero */}
      <section className="mx-auto grid max-w-[1400px] gap-4 px-5 md:grid-cols-2 md:gap-5 md:px-8">
        <div className="flex flex-col justify-between rounded-[28px] bg-white p-8 md:min-h-[560px] md:rounded-[32px] md:p-12">
          <div>
            <h1
              className="max-w-md text-[40px] font-extrabold leading-[1.05] tracking-tight text-black md:text-[52px]"
              style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
            >
              Unleash Your Style
              <br />
              Shop the Latest Trends
            </h1>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-black/55">
              Discover elevated streetwear essentials — sharp silhouettes, timeless neutrals, and
              pieces built for everyday confidence.
            </p>
            <a
              href="#shop"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-black py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white"
            >
              Shop Now
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-black/5 pt-8 md:mt-16">
            <p
              className="text-[22px] font-extrabold leading-none tracking-tight md:text-[26px]"
              style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
            >
              25 Million+
            </p>
            <p className="max-w-[220px] text-[11px] leading-snug text-black/50">
              Real reviews from our happy customers! See what fashion lovers are saying about our
              quality, style, and service.
            </p>
            <div className="flex -space-x-2.5">
              {avatars.map((a) => (
                <span
                  key={a.src}
                  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-black/10"
                >
                  <Image src={a.src} alt={a.alt} fill sizes="36px" className="object-cover" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#E8E8E6] md:min-h-[560px] md:rounded-[32px]">
          {/* Real seller lookbook photography goes here — this stand-in model
              shot is a placeholder until the seller uploads their own apparel. */}
          <Image
            src="/template-d/hero-model.jpg"
            alt="Model in plaid outerwear and cargo pants"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center scale-[1.04]"
          />
        </div>
      </section>

      {/* Trio row */}
      <section className="mx-auto mt-4 grid max-w-[1400px] gap-4 px-5 sm:grid-cols-3 md:mt-5 md:gap-5 md:px-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white md:rounded-[32px]">
          <Image
            src="/template-d/card-corduroy.jpg"
            alt="Cream corduroy jacket flat lay"
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover object-center scale-[1.04]"
          />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white md:rounded-[32px]">
          <Image
            src="/template-d/card-rack.jpg"
            alt="Jackets hanging on a rail"
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover object-center scale-[1.04]"
          />
        </div>
        <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-[28px] bg-white px-8 text-center md:rounded-[32px]">
          <h2
            className="max-w-[200px] text-[28px] font-extrabold leading-tight tracking-tight text-black md:text-[32px]"
            style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
          >
            Models wearing full outfits
          </h2>
          <a
            href="#shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white"
          >
            Explore more
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>
      </section>

      {/* Muted logo / trust strip */}
      <section
        aria-label="Featured partners"
        className="mx-auto mt-12 flex max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-6 px-5 opacity-55 grayscale md:mt-16 md:px-8"
      >
        {partnerLogos.map(({ name, sub, Icon }) => (
          <div key={name} className="flex items-center gap-2.5">
            <Icon className="h-7 w-7 shrink-0 text-black" strokeWidth={1.25} />
            <span className="leading-tight">
              <span
                className="block text-[11px] font-bold uppercase tracking-wide text-black"
                style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
              >
                {name}
              </span>
              <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-black/70">
                {sub}
              </span>
            </span>
          </div>
        ))}
      </section>

      {/* Our Category List */}
      <section className="mx-auto mt-16 max-w-[1400px] px-5 md:mt-20 md:px-8">
        <h2
          className="text-[28px] font-extrabold tracking-tight text-black md:text-[34px]"
          style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
        >
          Our Category List
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 md:mt-10 md:gap-5">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href="#shop"
              className="group relative aspect-[3/4] overflow-hidden rounded-[28px] bg-white md:rounded-[32px]"
            >
              <Image
                src={cat.src}
                alt={cat.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent px-5 pb-8 pt-24 text-center">
                <p
                  className="text-[18px] font-bold text-white md:text-[20px]"
                  style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
                >
                  {cat.label}
                </p>
                <p className="mt-1 text-[13px] font-medium text-white/90">{cat.count}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Our Products */}
      <section id="shop" className="mx-auto mt-16 max-w-[1400px] px-5 md:mt-24 md:px-8">
        <div className="text-center">
          <h2
            className="text-[28px] font-extrabold tracking-tight text-black md:text-[34px]"
            style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
          >
            Our Products
          </h2>
          <p className="mt-2 text-[14px] text-black/45 md:text-[15px]">Recently added shirts!</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6">
          {products.map((product, i) => (
            <article
              key={`${product.src}-${i}`}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="relative aspect-[4/5] bg-[#F7F7F5]">
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="px-5 pb-5 pt-4">
                <h3
                  className="text-[15px] font-bold text-black"
                  style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
                >
                  Plain White Shirt
                </h3>
                <p className="mt-1 text-[14px] text-black/80">$29.00</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto mt-16 max-w-[1400px] px-5 md:mt-24 md:px-8">
        <div className="relative min-h-[280px] overflow-hidden rounded-[28px] bg-[#EFEFEF] md:min-h-[320px] md:rounded-[32px]">
          {/* Full mockup strip for edge models; soft center wash hides baked copy */}
          <Image
            src="/template-d/promo-banner.jpg"
            alt=""
            fill
            sizes="1400px"
            className="object-cover object-center scale-[1.02]"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_#EFEFEF_0%,_#EFEFEF_28%,_transparent_58%)]"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center sm:px-10 md:py-[4.5rem]">
            <h2
              className="text-[36px] font-extrabold leading-none tracking-tight text-black md:text-[48px]"
              style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
            >
              Get 50% Off
            </h2>
            <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-black/70 md:text-[14px]">
              for all new product purchases
              <br />
              min. purchase $450.000
            </p>
            <a
              href="#shop"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-black py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white"
            >
              Shop Now
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Our Featured Collections */}
      <section className="mx-auto mt-16 max-w-[1400px] px-5 md:mt-24 md:px-8">
        <div className="text-center">
          <h2
            className="text-[28px] font-extrabold tracking-tight text-black md:text-[34px]"
            style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
          >
            Our Featured Collections
          </h2>
          <p className="mt-2 text-[14px] text-black/45 md:text-[15px]">Recently added shirts!</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
          {collections.map((collection) => (
            <a
              key={collection.title}
              href="#shop"
              className="group relative aspect-[5/3] overflow-hidden rounded-[28px] bg-white md:rounded-[32px]"
            >
              <Image
                src={collection.src}
                alt={collection.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 pb-5 pt-16 md:px-6 md:pb-6">
                <div className="flex items-end justify-between gap-4">
                  <p
                    className="text-[18px] font-extrabold leading-tight text-white md:text-[22px]"
                    style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
                  >
                    {collection.title}
                    <span className="block font-bold">/ Series</span>
                  </p>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-sm md:h-10 md:w-10"
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
