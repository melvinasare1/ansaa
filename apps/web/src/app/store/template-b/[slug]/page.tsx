import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/template-b/AddToCartButton";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { formatCedis } from "@/lib/price";
import { getActiveProductsForSeller, getSellerByStoreSlug } from "@/lib/storefront";
import { fillFromId, swatchHex } from "@/lib/swatch";
import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import type { Product } from "@ansaa/shared/types";

function CatalogMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-[family-name:var(--font-market)] text-2xl font-extrabold uppercase">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#0B1220]/55">{body}</p>
    </div>
  );
}

function cartImage(product: Product): string {
  const photo = product.images[0];
  if (photo) return photo;
  const firstColor = product.colors?.[0];
  if (firstColor) return swatchHex(firstColor);
  return fillFromId(product.id);
}

export default async function TemplateBHome({ params }: { params: { slug: string } }) {
  const path = `/store/template-b/${params.slug}`;

  if (!isSupabaseConfigured()) {
    return (
      <CatalogMessage
        title="Store not found"
        body="This storefront isn't connected yet. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      />
    );
  }

  const supabase = await createClient();
  const seller = await getSellerByStoreSlug(supabase, params.slug);
  if (!seller) {
    notFound();
  }

  const products = await getActiveProductsForSeller(supabase, seller.id);

  return (
    <div>
      <StorefrontTracker storeSlug={params.slug} path={path} />
      <div className="mb-6 border-2 border-[#0B1220] bg-[#FFE8A3] px-5 py-3">
        <p className="font-[family-name:var(--font-market)] text-sm font-extrabold uppercase">
          In stock, ships today if ordered before 4pm
        </p>
      </div>

      {products.length === 0 ? (
        <div className="border-2 border-dashed border-[#0B1220] px-5 py-16 text-center">
          <p className="font-[family-name:var(--font-market)] text-lg font-extrabold uppercase">
            No products yet
          </p>
          <p className="mt-2 text-sm text-[#0B1220]/50">
            This seller hasn&apos;t listed any active products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((product) => {
            const photo = product.images[0];
            return (
              <article
                key={product.id}
                className="border-2 border-[#0B1220] p-3 transition hover:bg-[#0B1220]/5"
              >
                <Link href={`${path}/product/${product.id}`}>
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0B1220]/10">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={product.name}
                        fill
                        sizes="(min-width: 640px) 30vw, 45vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-tight">{product.name}</p>
                </Link>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-[family-name:var(--font-market)] font-extrabold">
                    {formatCedis(product.priceCedis)}
                  </span>
                  <span className="text-xs text-[#0B1220]/50">{product.stockQuantity} left</span>
                </div>
                <div className="mt-2">
                  <AddToCartButton
                    productId={product.id}
                    name={product.name}
                    priceCedis={product.priceCedis}
                    image={cartImage(product)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
