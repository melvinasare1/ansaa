import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sellerFromRow } from "@ansaa/shared/mappers";
import { isSupabaseConfigured } from "@ansaa/shared/supabase/env";
import { createClient } from "@ansaa/shared/supabase/server";
import type { Seller, SellerUser } from "@ansaa/shared/types";

/** Look up the seller whose id (preferred) or uid matches the signed-in user. */
export async function fetchSellerForAuthUser(
  supabase: SupabaseClient,
  uid: string
): Promise<Seller | null> {
  if (!uid) return null;

  const byId = await supabase.from("sellers").select("*").eq("id", uid).maybeSingle();
  if (byId.data) return sellerFromRow(byId.data);

  const byUid = await supabase.from("sellers").select("*").eq("uid", uid).maybeSingle();
  if (byUid.data) return sellerFromRow(byUid.data);

  return null;
}

export async function getDashboardSession(): Promise<{
  user: SellerUser;
  seller: Seller | null;
  sellerError: string | null;
} | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const seller = await fetchSellerForAuthUser(supabase, user.id);
  return {
    user: { uid: user.id, email: user.email ?? null },
    seller,
    sellerError: seller
      ? null
      : "No seller profile is linked to this account. Finish creating it so your Auth user id matches sellers.id.",
  };
}

/**
 * Seller identity for dashboard API routes.
 * Verifies the Auth JWT from cookies (set by @supabase/ssr) and returns
 * the seller id, which equals auth.uid() once the seller row is created.
 */
export async function requireSellerSession(): Promise<
  { supabase: Awaited<ReturnType<typeof createClient>>; sellerId: string } | NextResponse
> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to continue." }, { status: 401 });
  }

  return { supabase, sellerId: user.id };
}
