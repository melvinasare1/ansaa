import Link from "next/link";
import { notFound } from "next/navigation";
import { MotorbikePlaceholder } from "@/components/store/motorbike-template/placeholders";
import { getPublishedBlogPost, getSellerByStoreSlug } from "@/lib/storefront";
import { createClient } from "@ansaa/shared/supabase/server";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";

function formatBlogDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MotorbikeBlogPostPage({
  params,
}: {
  params: { slug: string; postId: string };
}) {
  const base = `/store/motorbike-template/${params.slug}`;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const supabase = await createClient();
  const seller = await getSellerByStoreSlug(supabase, params.slug);
  if (!seller) {
    notFound();
  }

  const post = await getPublishedBlogPost(supabase, seller.id, params.postId);
  if (!post) {
    notFound();
  }

  return (
    <article className="bg-[#FFFFFF]">
      <div className="mx-auto max-w-[800px] px-6 py-16 md:px-10 md:py-24">
        <Link
          href={`${base}#blog`}
          className="text-[13px] font-semibold text-[#141414]/50 transition-colors hover:text-[#141414]"
        >
          ← Recent Blog Posts
        </Link>
        <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.14em] text-[#141414]/40">
          {formatBlogDate(post.publishedAt)}
        </p>
        <h1
          className="mt-3 text-[32px] font-extrabold tracking-tight text-[#141414] md:text-[42px]"
          style={{ fontFamily: "var(--font-ride-display), ui-sans-serif, system-ui" }}
        >
          {post.title}
        </h1>
        {post.imageUrl ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[24px] bg-[#E8E6E1]">
            <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="relative mt-8 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[24px] bg-[#E8E6E1]">
            <MotorbikePlaceholder className="h-[70%] w-[70%]" />
          </div>
        )}
        {post.excerpt ? (
          <p className="mt-8 text-[17px] leading-relaxed text-[#141414]/70">{post.excerpt}</p>
        ) : null}
        {post.body ? (
          <div className="mt-6 whitespace-pre-wrap text-[16px] leading-relaxed text-[#141414]/75">
            {post.body}
          </div>
        ) : null}
      </div>
    </article>
  );
}
