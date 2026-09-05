"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartIconButton } from "@/components/store/hair-beauty-template/AddToCartButton";
import { formatCedis } from "@/lib/price";
import type { Product } from "@ansaa/shared/types";

function salePercent(priceCedis: number, compareAtPriceCedis?: number): number | null {
  if (compareAtPriceCedis == null || compareAtPriceCedis <= priceCedis) return null;
  return Math.round(((compareAtPriceCedis - priceCedis) / compareAtPriceCedis) * 100);
}

function hasOptions(product: Product): boolean {
  return Boolean(
    (product.sizes?.length ?? 0) > 0 ||
      (product.colors?.length ?? 0) > 0 ||
      (product.variants?.length ?? 0) > 0
  );
}

export function ProductCard({
  product,
  productBase,
}: {
  product: Product;
  productBase: string;
}) {
  const href = `${productBase}/product/${product.id}`;
  const photo = product.images[0] ?? "";
  const discount = salePercent(product.priceCedis, product.compareAtPriceCedis);
  const showCompare =
    product.compareAtPriceCedis != null && product.compareAtPriceCedis > product.priceCedis;

  return (
    <article className="group h-full">
      <div className="relative">
        <Link
          href={href}
          className="relative block aspect-[3/4] overflow-hidden bg-[#efe6db] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a8165]"
        >
          {photo ? (
            <Image
              src={photo}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-3 text-center text-sm text-[#4f4a3d]/55">
              {product.name}
            </span>
          )}
          {discount !== null ? (
            <span className="absolute top-3 left-3 bg-[#8a8165] px-2.5 py-0.5 text-xs font-medium text-[#f7f1df]">
              -{discount}%
            </span>
          ) : null}
        </Link>
        {hasOptions(product) ? null : (
          <AddToCartIconButton
            productId={product.id}
            name={product.name}
            priceCedis={product.priceCedis}
            image={photo}
          />
        )}
      </div>
      <Link
        href={href}
        className="mt-3 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a8165]"
      >
        {product.category ? (
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-[#8a8165] uppercase">
            {product.category}
          </p>
        ) : null}
        <h3
          className="mt-1 line-clamp-2 text-[17px] font-medium leading-snug text-[#4f4a3d]"
          style={{ fontFamily: "var(--font-hair-display), ui-serif, Georgia" }}
        >
          {product.name}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-sm font-semibold text-[#4f4a3d]">{formatCedis(product.priceCedis)}</p>
          {showCompare ? (
            <p className="text-sm text-[#4f4a3d]/40 line-through">
              {formatCedis(product.compareAtPriceCedis!)}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({
  products,
  productBase,
  emptyTitle = "No products to show",
  emptyDescription = "Nothing matches this view yet. Try another category or check back soon.",
}: {
  products: Product[];
  productBase: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-[#d9cfc3] bg-[#faf7f2] px-6 py-16 text-center">
        <p className="font-medium text-[#4f4a3d]">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#4f4a3d]/55">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} productBase={productBase} />
        </li>
      ))}
    </ul>
  );
}
