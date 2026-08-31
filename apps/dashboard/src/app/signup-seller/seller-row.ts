import { sellerToInsert } from "@ansaa/shared/mappers";
import { storefrontHost } from "@ansaa/shared/store-domain";
import { PRICING_TIER_BASE_FEE_CEDIS, type PricingTier, type Seller } from "@ansaa/shared/types";
import { trialEndsAtFromNow } from "@/lib/trial";

export function newSellerInsertRow(input: {
  userId: string;
  businessName: string;
  storeSlug: string;
  email: string;
  phone: string;
  momoPhone: string;
  template: Seller["template"];
  pricingTier: PricingTier;
}) {
  return sellerToInsert({
    id: input.userId,
    uid: input.userId,
    businessName: input.businessName,
    domain: storefrontHost(input.storeSlug),
    domainType: "subdomain",
    domainVerified: true,
    storeSlug: input.storeSlug,
    template: input.template,
    email: input.email,
    phone: input.phone,
    momoPhone: input.momoPhone,
    pricingTier: input.pricingTier,
    baseFeeCedis: PRICING_TIER_BASE_FEE_CEDIS[input.pricingTier],
    status: "onboarding",
    createdAt: Date.now(),
    trialEndsAt: trialEndsAtFromNow(),
    hasBusinessRegistration: false,
    returnPolicy: "",
    storeContent: {},
    faqs: [],
  });
}
