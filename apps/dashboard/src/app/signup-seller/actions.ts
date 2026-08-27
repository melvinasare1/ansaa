"use server";

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { slugifyStoreName } from "@/lib/store-slug";
import { createAdminClient } from "@ansaa/shared/supabase/admin";
import { createClient } from "@ansaa/shared/supabase/server";
import type { Seller } from "@ansaa/shared/types";
import { newSellerInsertRow } from "./seller-row";

export type SignUpSellerResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { error: string; resumeProfile?: boolean };

type SellerSignupFields = {
  businessName: string;
  storeSlug: string;
  phone: string;
  template: Seller["template"];
};

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

function formatPostgresError(err: PostgrestError) {
  return [err.message, err.details, err.hint].filter(Boolean).join(" — ");
}

function normalizeSignupFields(input: SellerSignupFields) {
  const businessName = input.businessName.trim();
  const phone = input.phone.trim();
  const template: Seller["template"] = input.template === "template-b" ? "template-b" : "template-a";
  const baseSlug = slugifyStoreName(input.storeSlug || businessName);
  return { businessName, phone, template, baseSlug };
}

function validateSignupFields(fields: { businessName: string; phone: string; baseSlug: string }) {
  if (!fields.businessName) return "Business name is required.";
  if (!fields.phone) return "Phone is required.";
  if (!fields.baseSlug) return "Store slug must use letters or numbers.";
  return null;
}

export async function signUpSeller(input: {
  email: string;
  password: string;
  businessName: string;
  storeSlug: string;
  phone: string;
  template: Seller["template"];
}): Promise<SignUpSellerResult> {
  try {
    return await signUpSellerInner(input);
  } catch (err) {
    console.error("[signup-seller] unexpected error", err);
    return {
      error: err instanceof Error ? err.message : "Could not create the account. Try again.",
    };
  }
}

async function signUpSellerInner(input: {
  email: string;
  password: string;
  businessName: string;
  storeSlug: string;
  phone: string;
  template: Seller["template"];
}): Promise<SignUpSellerResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const fields = normalizeSignupFields(input);

  if (!email || !password) {
    return { error: "Email, password, and business name are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  const fieldError = validateSignupFields(fields);
  if (fieldError) return { error: fieldError };

  let admin: SupabaseClient;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "Seller signup is not configured. Set SUPABASE_SERVICE_ROLE_KEY so we can create the sellers row.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    const alreadyRegistered = /already registered|already exists|already been registered/i.test(
      error.message
    );
    if (alreadyRegistered) {
      return {
        error:
          "An account with this email already exists. Log in, then finish your seller profile if the dashboard asks you to.",
      };
    }
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    return { error: "Could not create the account. Try again." };
  }
  if (!user.identities || user.identities.length === 0) {
    return {
      error:
        "An account with this email already exists. Log in, then finish your seller profile if the dashboard asks you to.",
    };
  }

  const inserted = await insertSellerRow(admin, {
    userId: user.id,
    email,
    businessName: fields.businessName,
    phone: fields.phone,
    template: fields.template,
    baseSlug: fields.baseSlug,
  });

  if (inserted.ok) {
    return { ok: true, needsEmailConfirmation: !data.session };
  }

  if (inserted.alreadyHasProfile) {
    return { error: "An account for this email already has a seller profile. Log in instead." };
  }

  const rolledBack = await rollbackAuthUser(admin, user.id);
  if (rolledBack) {
    if (data.session) {
      await supabase.auth.signOut();
    }
    return { error: inserted.error };
  }

  if (data.session) {
    return {
      error: `${inserted.error} Your login exists without a seller profile — finish it on the next screen.`,
      resumeProfile: true,
    };
  }

  return {
    error: `${inserted.error} Your login was created without a seller profile. Confirm your email, log in, then finish your profile.`,
  };
}

export async function completeSellerProfile(
  input: SellerSignupFields
): Promise<SignUpSellerResult> {
  try {
    const fields = normalizeSignupFields(input);
    const fieldError = validateSignupFields(fields);
    if (fieldError) return { error: fieldError };

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Log in first, then finish your seller profile." };
    }

    let admin: SupabaseClient;
    try {
      admin = createAdminClient();
    } catch {
      return {
        error:
          "Seller signup is not configured. Set SUPABASE_SERVICE_ROLE_KEY so we can create the sellers row.",
      };
    }

    const email = (user.email ?? "").trim().toLowerCase();
    if (!email) {
      return { error: "This account has no email. Contact Fulfil." };
    }

    const inserted = await insertSellerRow(admin, {
      userId: user.id,
      email,
      businessName: fields.businessName,
      phone: fields.phone,
      template: fields.template,
      baseSlug: fields.baseSlug,
    });

    if (inserted.ok || inserted.alreadyHasProfile) {
      return { ok: true, needsEmailConfirmation: false };
    }

    return { error: inserted.error, resumeProfile: true };
  } catch (err) {
    console.error("[signup-seller] complete profile unexpected error", err);
    return {
      error: err instanceof Error ? err.message : "Could not create the seller profile. Try again.",
      resumeProfile: true,
    };
  }
}

async function insertSellerRow(
  admin: SupabaseClient,
  input: {
    userId: string;
    email: string;
    businessName: string;
    phone: string;
    template: Seller["template"];
    baseSlug: string;
  }
): Promise<{ ok: true } | { ok: false; error: string; alreadyHasProfile?: boolean }> {
  let storeSlug = input.baseSlug;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const row = newSellerInsertRow({
      userId: input.userId,
      businessName: input.businessName,
      storeSlug,
      email: input.email,
      phone: input.phone,
      template: input.template,
    });

    const { error: insertError } = await admin.from("sellers").insert(row);
    if (!insertError) {
      return { ok: true };
    }

    console.error("[signup-seller] sellers insert failed", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      userId: input.userId,
      storeSlug,
    });

    const isSlugTaken =
      insertError.code === "23505" &&
      (insertError.message.includes("store_slug") || insertError.message.includes("sellers_store_slug"));
    const isIdTaken =
      insertError.code === "23505" &&
      (insertError.message.includes("sellers_pkey") ||
        insertError.message.includes("sellers_uid") ||
        insertError.message.includes("(id)") ||
        insertError.message.includes("(uid)"));

    if (isIdTaken) {
      return { ok: false, error: formatPostgresError(insertError), alreadyHasProfile: true };
    }
    if (isSlugTaken) {
      storeSlug = `${input.baseSlug}-${randomSuffix()}`;
      continue;
    }

    return { ok: false, error: formatPostgresError(insertError) };
  }

  return { ok: false, error: "That store URL is taken. Try a different slug." };
}

async function rollbackAuthUser(admin: SupabaseClient, userId: string) {
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("[signup-seller] failed to roll back auth user", {
      userId,
      message: error.message,
      status: error.status,
    });
    return false;
  }
  return true;
}
