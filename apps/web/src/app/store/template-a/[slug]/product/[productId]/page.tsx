import Link from "next/link";
import { ProductDetail } from "@/components/store/template-a/ProductDetail";
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
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Store not found</h1>
        <p className="mt-2 text-sm text-black/55">No seller matches this store URL.</p>
      </div>
    );
  }

  const product = await getStorefrontProduct(supabase, params.productId, seller.id);
  if (!product) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Product not found</h1>
        <p className="mt-2 text-sm text-black/55">
          This product does not exist, is not active, or does not belong to this store.
        </p>
        <Link href={catalogHref} className="mt-6 text-sm font-semibold underline underline-offset-2">
          Back to catalog
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} slug={params.slug} />;
}
