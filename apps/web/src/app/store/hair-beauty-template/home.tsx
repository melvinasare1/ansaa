import Image from "next/image";
import Link from "next/link";
import { storefrontContentValue } from "@ansaa/shared/storefront-content-schema";
import { HomeCatalogue } from "@/components/store/hair-beauty-template/HomeCatalogue";
import { listHairProducts } from "@/components/store/hair-beauty-template/catalog";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { getStorefrontSellerBySlug } from "@/lib/live-catalog";
import { storefrontBase } from "@/lib/store-path";

const DEFAULT_HERO_IMAGE = "/store/hair-beauty-template/hero.jpg";
const DEFAULT_HEADLINE = "Luxury Hair Crafted For Every Crown";
const DEFAULT_SUBTEXT =
  "Premium human hair wigs, bundles, and extensions — soft finish, lasting quality, delivered across Ghana.";

const BENEFITS = [
  "100% Human Hair",
  "Premium Quality",
  "Long Lasting",
  "Fast & Secure Shipping",
] as const;

export async function HairBeautyHome({ storeSlug }: { storeSlug?: string } = {}) {
  const base = storefrontBase("hair-beauty-template", storeSlug);
  const seller = storeSlug ? await getStorefrontSellerBySlug(storeSlug) : null;
  const heroHeadline = storefrontContentValue(seller?.storeContent, "heroHeadline", DEFAULT_HEADLINE);
  const heroSubtext = storefrontContentValue(seller?.storeContent, "heroSubtext", DEFAULT_SUBTEXT);
  const heroImageUrl = storefrontContentValue(
    seller?.storeContent,
    "heroImageUrl",
    DEFAULT_HERO_IMAGE
  );
  const products = await listHairProducts(storeSlug);

  return (
    <div>
      <StorefrontTracker storeSlug={storeSlug ?? "hair-beauty-template"} path={base} />

      <section className="relative min-h-[88vh] overflow-hidden bg-[#4f4a3d] sm:min-h-[92vh]">
        <Image
          src={heroImageUrl || DEFAULT_HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4f4a3d]/75 via-[#4f4a3d]/35 to-[#4f4a3d]/20" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-[90rem] flex-col justify-end px-4 pb-28 pt-20 sm:min-h-[92vh] sm:px-6 sm:pb-32 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#f7f1df]/85 uppercase">
            Premium Human Hair
          </p>
          <h1
            className="mt-4 max-w-2xl text-4xl font-medium leading-[1.08] tracking-tight text-[#f7f1df] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-hair-display), ui-serif, Georgia" }}
          >
            {heroHeadline}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[#f7f1df]/85 sm:text-lg">
            {heroSubtext}
          </p>
          <Link
            href={`${base}/search`}
            className="mt-8 inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#f7f1df] px-8 text-sm font-semibold text-[#4f4a3d] transition hover:bg-white"
          >
            Shop the collection
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-[#4f4a3d]/55 backdrop-blur-sm">
          <ul className="mx-auto grid max-w-[90rem] grid-cols-2 gap-px sm:grid-cols-4">
            {BENEFITS.map((label) => (
              <li
                key={label}
                className="px-4 py-4 text-center text-[11px] font-semibold tracking-[0.12em] text-[#f7f1df]/90 uppercase sm:px-6 sm:py-5 sm:text-xs"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <HomeCatalogue products={products} productBase={base} />
      </div>
    </div>
  );
}
