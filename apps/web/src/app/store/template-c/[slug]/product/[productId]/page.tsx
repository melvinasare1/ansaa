import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/template-c/ProductDetail";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { getSellerByStoreSlug, getStorefrontProduct } from "@/lib/storefront";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import { createClient } from "@ansaa/shared/supabase/server";

export default async function TemplateCProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  const catalogHref = `/store/template-c/${params.slug}`;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
        <h1
          className="text-[32px] font-medium text-[#2B4239]"
          style={{ fontFamily: "var(--font-homedine-serif), ui-serif, Georgia" }}
        >
          Store not found
        </h1>
        <p className="mt-2 text-sm text-[#2B4239]/55">
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

  const product = await getStorefrontProduct(supabase, params.productId, seller.id);
  if (!product) {
    notFound();
  }

  return (
    <>
      <StorefrontTracker
        storeSlug={params.slug}
        path={`${catalogHref}/product/${product.id}`}
        productId={product.id}
      />
      <ProductDetail product={product} slug={params.slug} />
    </>
  );
}
