import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/template-a/ProductDetail";
import { StorefrontTracker } from "@/components/store/StorefrontTracker";
import { getSellerByStoreSlug, getStorefrontProduct } from "@/lib/storefront";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import { createClient } from "@ansaa/shared/supabase/server";

export default async function TemplateAProductPage({
  params,
}: {
  params: { slug: string; productId: string };
}) {
  const catalogHref = `/store/template-a/${params.slug}`;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Store not found</h1>
        <p className="mt-2 text-sm text-black/55">
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
