"use server";

import { faqsFromUnknown } from "@ansaa/shared/mappers";
import { fetchSellerForAuthUser } from "@/lib/seller";
import { getVerificationDocumentUrl } from "@ansaa/shared/id-verification-admin";
import { createClient } from "@ansaa/shared/supabase/server";
import type { StoreFaq } from "@ansaa/shared/types";

function isOwnDocumentPath(path: string, sellerId: string): boolean {
  const prefix = `${sellerId}/`;
  return (
    Boolean(sellerId) &&
    path.startsWith(prefix) &&
    !path.includes("..") &&
    !path.startsWith("/")
  );
}

/** Signed preview URL for the signed-in seller's own id-verification object. */
export async function createVerificationDocumentPreviewUrl(
  path: string
): Promise<{ url: string } | { error: string }> {
  const objectPath = path.trim();
  if (!objectPath) return { error: "Missing document path." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to continue." };

  const seller = await fetchSellerForAuthUser(supabase, user.id);
  if (!seller) return { error: "No seller profile is linked to this account." };

  if (!isOwnDocumentPath(objectPath, seller.id)) {
    return { error: "You can only preview your own documents." };
  }

  try {
    const url = await getVerificationDocumentUrl(objectPath);
    return { url };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not create a preview link.",
    };
  }
}

export async function saveSellerFaqs(
  faqs: StoreFaq[]
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to continue." };

  const seller = await fetchSellerForAuthUser(supabase, user.id);
  if (!seller) return { error: "No seller profile is linked to this account." };

  const cleaned = faqsFromUnknown(faqs).slice(0, 20).map((item) => ({
    question: item.question.slice(0, 200),
    answer: item.answer.slice(0, 1000),
  }));

  const { error } = await supabase
    .from("sellers")
    .update({ faqs: cleaned })
    .eq("id", seller.id);

  if (error) {
    console.error("Failed to save seller FAQs", error);
    return { error: "Could not save FAQs. Try again." };
  }

  return { ok: true };
}
