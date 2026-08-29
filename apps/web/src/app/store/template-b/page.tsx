import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/store/template-b/AddToCartButton";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { formatCedis } from "@/lib/price";
import { fillFromId, swatchHex } from "@/lib/swatch";
import type { Product } from "@ansaa/shared/types";

function cartImage(product: Product): string {
  const photo = product.images[0];
  if (photo) return photo;
  const firstColor = product.colors?.[0];
  if (firstColor) return swatchHex(firstColor);
  return fillFromId(product.id);
}

export default function TemplateBHome() {
  const path = "/store/template-b";
  const products: Product[] = [];

  return (
    <div>
      <StorefrontTracker storeSlug="template-b" path={path} />
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
            Products will appear here on a client site copied from this template.
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
