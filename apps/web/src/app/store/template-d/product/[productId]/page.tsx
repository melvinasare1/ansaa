import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/template-d/ProductDetail";
import { getTemplateDProductPage, listTemplateDProducts } from "@/components/store/template-d/catalog";
import { formatCedis } from "@/lib/price";
import { pickRelatedCatalogProducts } from "@/lib/related-products";

export default async function TemplateDProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const [page, catalog] = await Promise.all([
    getTemplateDProductPage(params.productId),
    listTemplateDProducts(),
  ]);
  if (!page) notFound();
  const related = pickRelatedCatalogProducts(page.product, catalog, 4);

  return (
    <ProductDetail product={page.product} faqs={page.faqs}>
      {related.length > 0 ? (
        <section className="mt-12 border-t border-black/8 pt-10">
          <h2
            className="text-[22px] font-extrabold tracking-tight text-black md:text-[28px]"
            style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
          >
            Related products
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((product) => {
              const photo = product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/store/template-d/product/${product.id}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="relative aspect-[4/5] bg-[#F7F7F5]">
                    {photo ? (
                      <Image src={photo} alt={product.name} fill sizes="25vw" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="px-4 py-4">
                    <p
                      className="text-[15px] font-bold text-black"
                      style={{ fontFamily: "var(--font-stylehive-display), ui-sans-serif, system-ui" }}
                    >
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{formatCedis(product.priceCedis)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </ProductDetail>
  );
}
