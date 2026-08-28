import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Clock,
  Cog,
  Handshake,
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
const CREAM = "#F7F5F0";

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

function StarRating({ value }: { value: number }) {
  return (
    <div className="mt-1.5 flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          fill={i < value ? ORANGE : "none"}
          color={ORANGE}
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

      <section className="relative flex min-h-[calc(100svh-4.75rem)] flex-col overflow-hidden bg-[#141414]">
        {/* Real seller photography goes here — this stand-in vehicle drawing is a
            placeholder until the seller uploads their own shop photography. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,#2a2a2a_0%,#141414_58%)]" />
          <HeroVehiclePlaceholder className="absolute -right-8 bottom-16 h-[58%] w-[70%] max-w-[780px] opacity-80 md:right-[4%] md:h-[68%] md:w-[52%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent md:via-[#141414]/55" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pb-28 pt-14 md:px-8 md:pb-32 md:pt-20">
          <h1
            className="max-w-xl text-[40px] font-extrabold leading-[1.05] tracking-tight text-white md:text-[56px] lg:text-[64px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Ride Better.
            <br />
            Ride Together.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75 md:text-[16px]">
            Motorbikes, bicycles, mopeds, and scooters — chosen for the ride, backed by
            people who know the machines.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#shop"
              className="inline-flex items-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ORANGE }}
            >
              Shop Now
            </a>
            <a
              href="#about"
              className="inline-flex items-center rounded-md border border-white bg-transparent px-6 py-3 text-sm font-semibold text-white"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-[#0c0c0c]/70">
          <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-5 px-5 py-5 md:grid-cols-4 md:px-8 md:py-6">
            {trustBadges.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-3 text-white">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} color={ORANGE} />
                <span className="text-[12px] font-medium md:text-[13px]">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="shop" className="bg-white">
        <div className="mx-auto max-w-[1400px] px-5 pt-14 pb-10 md:px-8 md:pt-20 md:pb-12">
          <h2
            className="text-[36px] font-extrabold tracking-tight text-[#141414] md:text-[44px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Shop
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-10 md:gap-6">
            {categories.map((category) => (
              <article
                key={category.id}
                id={category.id}
                className="flex flex-col overflow-hidden rounded-2xl px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8"
                style={{ backgroundColor: CREAM }}
              >
                <div className="relative flex aspect-[16/10] items-center justify-center">
                  {/* Real seller photography goes here — category vehicle photo. */}
                  <category.Placeholder className="h-[85%] w-[90%]" />
                </div>
                <p
                  className="mt-4 text-center text-[18px] font-extrabold uppercase tracking-[0.04em] text-[#141414] md:text-[20px]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {category.label}
                </p>
                <a
                  href={`#${category.id}`}
                  className="mx-auto mt-4 inline-flex items-center rounded-full border border-[#141414] px-5 py-2 text-[13px] font-semibold text-[#141414] transition-colors hover:bg-[#141414] hover:text-white"
                >
                  View {category.label}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-6 md:pb-8">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div
            id="featured"
            className="relative grid overflow-hidden rounded-2xl bg-[#141414] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
          >
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse at 88% 55%, #4a3220 0%, transparent 52%)",
              }}
            />
            <div className="relative z-10 flex flex-col justify-center px-8 py-12 md:px-12 md:py-16 lg:px-16">
              <h2
                className="text-[28px] font-extrabold tracking-tight text-white md:text-[34px]"
                style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
              >
                Apex R9
              </h2>
              <p className="mt-2 text-[20px] font-semibold" style={{ color: ORANGE }}>
                {formatCedis(18900)}
              </p>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/75 md:text-[15px]">
                Street-ready motorbike with a punchy engine, upright seating, and the range
                to cover town and the open road.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#accessories"
                  className="inline-flex items-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: ORANGE }}
                >
                  More Info
                </a>
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 rounded-md border border-white px-6 py-3 text-sm font-semibold text-white"
                >
                  View Collections
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <div className="relative min-h-[240px] md:min-h-[340px]">
              {/* Real seller photography goes here — featured vehicle photo. */}
              <PromoVehiclePlaceholder className="absolute -right-10 bottom-0 h-[108%] w-[118%] max-w-none md:-right-6" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {trustFeatures.map(({ label, body, Icon }) => (
              <li key={label}>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${ORANGE}55` }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} color={ORANGE} />
                </span>
                <h3
                  className="mt-4 text-[16px] font-extrabold leading-snug text-[#141414] md:text-[17px]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {label}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#141414]/55">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="accessories" className="bg-[#F7F5F0]">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8 md:pb-24">
          <h2
            className="text-[36px] font-extrabold tracking-tight text-[#141414] md:text-[44px]"
            style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
          >
            Gear &amp; Accessories
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-10 md:gap-6">
            {accessories.map((item) => (
              <article key={item.name} className="overflow-hidden rounded-2xl bg-[#EDEDED] p-5 md:p-6">
                <div className="relative flex aspect-[4/3] items-center justify-center">
                  {/* Real seller photography goes here — accessory product photo. */}
                  <item.Placeholder className="h-[80%] w-[80%]" />
                </div>
                <div className="mt-4 flex gap-1.5">
                  {item.colors.map((hex) => (
                    <span
                      key={hex}
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: hex,
                        boxShadow: hex === "#F4C430" || hex === "#ADB5BD" ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : undefined,
                      }}
                    />
                  ))}
                </div>
                <h3
                  className="mt-3 text-[15px] font-extrabold text-[#141414]"
                  style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
                >
                  {item.name}
                </h3>
                <p className="mt-1 text-[14px] text-[#141414]/80">{formatCedis(item.priceCedis)}</p>
                <StarRating value={item.rating} />
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center md:mt-12">
            <a
              href="#accessories"
              className="inline-flex items-center rounded-md border px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em]"
              style={{ borderColor: ORANGE, color: ORANGE }}
            >
              View More Accessories
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
