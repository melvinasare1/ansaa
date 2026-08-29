import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/template-b/ProductDetail";
import { getTemplateBProductPage, listTemplateBProducts } from "@/components/store/template-b/catalog";
import { formatCedis } from "@/lib/price";
import { pickRelatedCatalogProducts } from "@/lib/related-products";

export default async function TemplateBProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const [page, catalog] = await Promise.all([
    getTemplateBProductPage(params.productId),
    listTemplateBProducts(),
  ]);
  if (!page) notFound();
  const related = pickRelatedCatalogProducts(page.product, catalog, 4);

  return (
    <ProductDetail product={page.product} faqs={page.faqs}>
      {related.length > 0 ? (
        <section className="mt-10 border-t-2 border-[#0B1220] pt-8">
          <h2 className="font-[family-name:var(--font-market)] text-lg font-extrabold uppercase">
            Related products
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((product) => {
              const photo = product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/store/template-b/product/${product.id}`}
                  className="border-2 border-[#0B1220] p-3 transition hover:bg-[#0B1220]/5"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#0B1220]/10">
                    {photo ? (
                      <Image src={photo} alt={product.name} fill sizes="20vw" className="object-cover" />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-tight">{product.name}</p>
                  <p className="mt-1 font-[family-name:var(--font-market)] font-extrabold">
                    {formatCedis(product.priceCedis)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </ProductDetail>
  );
}
