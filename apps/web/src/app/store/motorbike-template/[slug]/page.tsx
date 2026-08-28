import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Bike,
  Calendar,
  ChevronRight,
  Clock,
  Cog,
  Handshake,
  MessageCircle,
  Shield,
  Star,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import {
  BagPlaceholder,
  BicyclePlaceholder,
  BootsPlaceholder,
  EbikePlaceholder,
  GlovesPlaceholder,
  HelmetPlaceholder,
  HeroVehiclePlaceholder,
  LightPlaceholder,
  MopedPlaceholder,
  MotorbikePlaceholder,
  PromoVehiclePlaceholder,
  RotorPlaceholder,
  ScooterPlaceholder,
} from "@/components/store/motorbike-template/placeholders";
import { formatCedis } from "@/lib/price";
import { getSellerByStoreSlug } from "@/lib/storefront";
import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";

const ORANGE = "#E8622C";

const trustBadges = [
  { label: "Premium Components", Icon: Cog },
  { label: "Knowledgeable Staff", Icon: User },
  { label: "Warranty", Icon: Shield },
  { label: "Trial Period", Icon: Clock },
] as const;

const categories = [
  { id: "motorbikes", label: "Motorbikes", Placeholder: MotorbikePlaceholder },
  { id: "bicycles", label: "Bicycles", Placeholder: BicyclePlaceholder },
  { id: "mopeds", label: "Mopeds", Placeholder: MopedPlaceholder },
  { id: "scooters", label: "Scooters", Placeholder: ScooterPlaceholder },
] as const;

const trustFeatures = [
  {
    label: "Trusted Brands",
    body: "Machines and parts from names riders already know — stocked because they last.",
    Icon: Award,
  },
  {
    label: "Certified Repair Specialists",
    body: "Workshop techs trained on motorbikes, mopeds, scooters, and bicycles.",
    Icon: Wrench,
  },
  {
    label: "Community Support",
    body: "Fit advice, group rides, and a shop floor that talks riding, not just SKUs.",
    Icon: Users,
  },
  {
    label: "Tailored Service",
    body: "Setup, servicing, and gear recommendations sized to how you actually ride.",
    Icon: Handshake,
  },
] as const;

const accessories = [
  {
    name: "Trail Helmet",
    priceCedis: 450,
    rating: 5,
    colors: ["#7B2CBF", "#E03131", "#F4C430", "#2F9E44"],
    Placeholder: HelmetPlaceholder,
  },
  {
    name: "Riding Gloves",
    priceCedis: 95,
    rating: 4,
    colors: ["#111111", "#C08A4D", "#ADB5BD"],
    Placeholder: GlovesPlaceholder,
  },
  {
    name: "Handlebar Bag",
    priceCedis: 180,
    rating: 5,
    colors: ["#C0392B", "#1D3557", "#111111"],
    Placeholder: BagPlaceholder,
  },
  {
    name: "Disc Brake Kit",
    priceCedis: 240,
    rating: 4,
    colors: ["#3A3A3A", "#ADB5BD"],
    Placeholder: RotorPlaceholder,
  },
  {
    name: "LED Headlight",
    priceCedis: 150,
    rating: 5,
    colors: ["#111111", "#F4C430"],
    Placeholder: LightPlaceholder,
  },
  {
    name: "Touring Boots",
    priceCedis: 380,
    rating: 4,
    colors: ["#111111", "#C08A4D"],
    Placeholder: BootsPlaceholder,
  },
] as const;

const valueFeatures = [
  {
    label: "Special Offers",
    body: "Seasonal drops, bundle pricing, and trade-in credit on machines you already ride.",
    Icon: Bike,
    href: "#featured",
  },
  {
    label: "Amazing Events",
    body: "Shop rides, demo days, and weekend loops — show up, clip in, ride with the floor.",
    Icon: Calendar,
    href: "#blog",
  },
  {
    label: "Human Reviews",
    body: "Notes from riders who commute, tour, and wrench — not a star average from nowhere.",
    Icon: MessageCircle,
    href: "#accessories",
  },
] as const;

const blogPosts = [
  {
    date: "12 Aug 2026",
    title: "How to pick a commuter scooter for Accra traffic",
    excerpt: "Range, brakes, and a seat you can live with at 7am — what actually matters on the road.",
    Placeholder: ScooterPlaceholder,
  },
  {
    date: "28 Jul 2026",
    title: "Sunday loop: Labadi to the hills and back",
    excerpt: "A mixed-bike group ride, a coffee stop, and the gear we actually packed.",
    Placeholder: BicyclePlaceholder,
  },
  {
    date: "09 Jul 2026",
    title: "Wet-season service: five checks before the rains",
    excerpt: "Chain, lights, pads, and a battery that still holds a charge when the sky opens.",
    Placeholder: MotorbikePlaceholder,
  },
] as const;

function StarRating({ value }: { value: number }) {
  return (
    <div className="mt-1.5 flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          fill={i < value ? "#E8B923" : "none"}
          color="#E8B923"
          strokeWidth={1.6}
        />
      ))}
    </div>
  );
}

export default async function MotorbikeTemplateHome({
  params,
}: {
  params: { slug: string };
}) {
  const base = `/store/motorbike-template/${params.slug}`;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
        <h1
          className="text-[32px] font-extrabold tracking-tight"
          style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
        >
          Store not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-black/55">
          This storefront isn&apos;t connected yet. Check NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const seller = await getSellerByStoreSlug(supabase, params.slug);
  if (!seller) {
    notFound();
  }

  return (
    <div>
      <StorefrontTracker storeSlug={params.slug} path={base} />

      <section className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-[#141414]">
        {/* Real seller photography goes here — this stand-in is a placeholder
            until the seller uploads their own shop photography. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[#0c0c0c]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,#6a4a32_0%,transparent_42%),radial-gradient(ellipse_at_60%_70%,#2a1c14_0%,transparent_50%)]" />
          <HeroVehiclePlaceholder className="absolute -right-[8%] bottom-[12%] h-[72%] w-[78%] max-w-[820px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)] md:right-[2%] md:h-[78%] md:w-[54%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/75 to-transparent md:from-[#141414] md:via-[#141414]/50 md:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-32 pt-16 md:px-10 md:pb-36 md:pt-24">
          <h1
            className="max-w-xl text-[42px] font-extrabold leading-[1.02] tracking-tight text-white md:text-[58px] lg:text-[68px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Ride Better.
            <br />
            Ride Together.
          </h1>
          <p className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-white/70 md:text-[16px]">
            Motorbikes, bicycles, mopeds, and scooters — chosen for the ride, backed by
            people who know the machines.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href="#shop"
              className="inline-flex items-center rounded-lg px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ORANGE }}
            >
              Shop Now
            </a>
            <a
              href="#about"
              className="inline-flex items-center rounded-lg border border-white/90 bg-transparent px-7 py-3 text-sm font-semibold text-white"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-black/45 backdrop-blur-[2px]">
          <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-5 px-6 py-5 md:grid-cols-4 md:px-10 md:py-6">
            {trustBadges.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-3 text-white">
                <Icon className="h-[18px] w-[18px] shrink-0 text-white" strokeWidth={1.6} />
                <span className="text-[13px] font-medium tracking-wide">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="shop" className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-16">
          <h2
            className="text-[40px] font-extrabold tracking-tight text-[#141414] md:text-[48px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Shop
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 md:gap-8">
            {categories.map((category) => (
              <article
                key={category.id}
                id={category.id}
                className="flex flex-col rounded-[28px] px-8 pb-9 pt-10 md:px-10 md:pb-11 md:pt-12"
                style={{ backgroundColor: "#EFEBE3" }}
              >
                <div className="relative flex aspect-[16/9] items-center justify-center">
                  {/* Real seller photography goes here — category vehicle photo. */}
                  <category.Placeholder className="h-[88%] w-[88%] drop-shadow-[0_22px_28px_rgba(20,20,20,0.18)]" />
                </div>
                <p
                  className="mt-6 text-center text-[17px] font-extrabold uppercase tracking-[0.08em] text-[#141414] md:text-[19px]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {category.label}
                </p>
                <a
                  href={`#${category.id}`}
                  className="mx-auto mt-4 inline-flex items-center gap-1 rounded-full border border-[#141414] px-5 py-1.5 text-[12px] font-semibold text-[#141414] transition-colors hover:bg-[#141414] hover:text-white"
                >
                  Shop Now
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F0] pb-8 md:pb-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div
            id="featured"
            className="relative grid overflow-hidden rounded-[28px] bg-[#141414] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)]"
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse at 18% 48%, rgba(232,98,44,0.28) 0%, transparent 52%), radial-gradient(ellipse at 88% 60%, #4a3220 0%, transparent 48%)",
              }}
            />
            <div className="relative z-10 flex flex-col justify-center px-8 py-14 md:px-14 md:py-20 lg:px-16">
              <h2
                className="text-[30px] font-extrabold tracking-tight text-white md:text-[38px]"
                style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
              >
                Apex R9
              </h2>
              <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: ORANGE }}>
                Street Motorbike
              </p>
              <p className="mt-2 text-[22px] font-semibold" style={{ color: ORANGE }}>
                {formatCedis(18900)}
              </p>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70 md:text-[15px]">
                Street-ready motorbike with a punchy engine, upright seating, and the range
                to cover town and the open road.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#accessories"
                  className="inline-flex items-center rounded-lg px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: ORANGE }}
                >
                  More Info
                </a>
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/90 px-7 py-3 text-sm font-semibold text-white"
                >
                  View Collections
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div className="relative min-h-[260px] md:min-h-[380px]">
              {/* Real seller photography goes here — featured vehicle photo. */}
              <PromoVehiclePlaceholder className="absolute -right-16 -bottom-10 h-[125%] w-[130%] max-w-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)] md:-right-10 md:-bottom-12" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {trustFeatures.map(({ label, body, Icon }) => (
              <li key={label} className="rounded-[24px] bg-white/80 px-6 py-8 md:px-7 md:py-9">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: ORANGE }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.75} color="#fff" />
                </span>
                <h3
                  className="mt-5 text-[17px] font-extrabold leading-snug text-[#141414]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {label}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#141414]/50">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="accessories" className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10 md:pb-20">
          <h2
            className="text-[40px] font-extrabold tracking-tight text-[#141414] md:text-[48px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Gear &amp; Accessories
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
            {accessories.map((item) => (
              <article key={item.name}>
                <div className="relative flex aspect-square items-center justify-center rounded-[24px] bg-[#E8E6E1]">
                  {/* Real seller photography goes here — accessory product photo. */}
                  <item.Placeholder className="h-[62%] w-[62%] drop-shadow-[0_14px_18px_rgba(20,20,20,0.16)]" />
                </div>
                <div className="mt-4 flex gap-1.5 px-0.5">
                  {item.colors.map((hex) => (
                    <span
                      key={hex}
                      className="h-3.5 w-3.5 rounded-full"
                      style={{
                        backgroundColor: hex,
                        boxShadow: hex === "#F4C430" || hex === "#ADB5BD" ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : undefined,
                      }}
                    />
                  ))}
                </div>
                <h3
                  className="mt-3 text-[16px] font-extrabold text-[#141414]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {item.name}
                </h3>
                <p className="mt-1 text-[14px] text-[#141414]/55">{formatCedis(item.priceCedis)}</p>
                <StarRating value={item.rating} />
              </article>
            ))}
          </div>
          <div className="mt-12 flex justify-center md:mt-14">
            <a
              href="#accessories"
              className="inline-flex items-center rounded-lg border px-10 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: ORANGE, color: ORANGE }}
            >
              View All Accessories
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            {valueFeatures.map(({ label, body, Icon, href }) => (
              <li key={label} className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#141414]">
                  <Icon className="h-7 w-7 text-white" strokeWidth={1.6} color="#fff" />
                </span>
                <h3
                  className="mt-6 text-[20px] font-extrabold text-[#141414]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {label}
                </h3>
                <p className="mt-3 max-w-[280px] text-[14px] leading-relaxed text-[#141414]/50">{body}</p>
                <a
                  href={href}
                  className="mt-6 inline-flex items-center rounded-lg border border-[#141414] px-5 py-2 text-[13px] font-semibold text-[#141414] transition-colors hover:bg-[#141414] hover:text-white"
                >
                  Learn More
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F7F5F0] pb-8 md:pb-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="relative grid overflow-hidden rounded-[28px] bg-[#141414] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)]">
            <div className="relative min-h-[280px] md:min-h-[380px]">
              {/* Real seller photography goes here — featured e-bike photo. */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_38%_52%,#3a2a20_0%,transparent_58%)]" />
              <EbikePlaceholder className="absolute -left-8 bottom-[-6%] h-[108%] w-[118%] max-w-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.4)] md:-left-4" />
              <div className="absolute left-[8%] top-[22%] z-10 flex items-center">
                <div className="max-w-[210px] rounded-xl bg-black/55 px-3.5 py-2.5 ring-1 ring-white/15 backdrop-blur-sm">
                  <p className="text-[12px] font-semibold leading-snug text-white">
                    Super Powerful Battery
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/55">
                    The best range ever seen for a bike like this.
                  </p>
                </div>
                <span className="hidden h-px w-12 bg-white/70 sm:block" aria-hidden />
                <span className="hidden h-2 w-2 rounded-full bg-white sm:block" aria-hidden />
              </div>
            </div>
            <div className="relative z-10 flex flex-col justify-center px-8 py-12 md:px-12 md:py-16 lg:pr-16">
              <h2
                className="text-[30px] font-extrabold tracking-tight text-white md:text-[36px]"
                style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
              >
                E-Bike
              </h2>
              <p className="mt-2 text-[16px] font-medium text-white/55">
                From {formatCedis(9450)}
              </p>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70 md:text-[15px]">
                Quiet power for city hops and weekend loops — a removable battery, disc
                brakes, and a ride that stays composed in traffic.
              </p>
              <a
                href="#shop"
                className="mt-8 inline-flex w-fit items-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <h2
            className="text-[40px] font-extrabold tracking-tight text-[#141414] md:text-[48px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Recent Blog Posts
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 md:mt-12 md:gap-6">
            {blogPosts.map((post) => (
              <article key={post.title}>
                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[24px] bg-[#E8E6E1]">
                  <post.Placeholder className="h-[70%] w-[80%] drop-shadow-[0_12px_16px_rgba(20,20,20,0.14)]" />
                </div>
                <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.14em] text-[#141414]/40">
                  {post.date}
                </p>
                <h3
                  className="mt-2 max-w-[280px] text-[18px] font-extrabold leading-snug text-[#141414]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {post.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#141414]/50">{post.excerpt}</p>
                <a
                  href="#blog"
                  className="mt-5 inline-flex items-center rounded-lg border border-[#141414] px-4 py-2 text-[13px] font-semibold text-[#141414] transition-colors hover:bg-[#141414] hover:text-white"
                >
                  Read More
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
