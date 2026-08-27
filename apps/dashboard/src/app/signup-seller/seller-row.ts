import { sellerToInsert } from "@ansaa/shared/mappers";
import { PRICING_TIER_BASE_FEE_CEDIS, type Seller } from "@ansaa/shared/types";

export const DEFAULT_SIGNUP_PRICING_TIER = "website_admin" as const;

export function newSellerInsertRow(input: {
  userId: string;
  businessName: string;
  storeSlug: string;
  email: string;
  phone: string;
  template: Seller["template"];
}) {
  return sellerToInsert({
    id: input.userId,
    uid: input.userId,
    businessName: input.businessName,
    domain: `${input.storeSlug}.local`,
    storeSlug: input.storeSlug,
    template: input.template,
    email: input.email,
    phone: input.phone,
    pricingTier: DEFAULT_SIGNUP_PRICING_TIER,
    baseFeeCedis: PRICING_TIER_BASE_FEE_CEDIS[DEFAULT_SIGNUP_PRICING_TIER],
    status: "onboarding",
    createdAt: Date.now(),
  });
}
