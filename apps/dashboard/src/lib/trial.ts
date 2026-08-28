export const TRIAL_LENGTH_DAYS = 14;
export const TRIAL_BANNER_DISMISS_KEY = "ansaa-trial-banner-dismissed";
export const TRIAL_EXPIRY_MODAL_DISMISS_KEY = "ansaa-trial-expiry-modal-dismissed";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type TrialBannerState = {
  expired: boolean;
  daysLeft: number;
};

export function trialEndsAtFromNow(now = Date.now()): number {
  return now + TRIAL_LENGTH_DAYS * MS_PER_DAY;
}

/** Null when the seller has no trial (trial_ends_at unset). */
export function trialBannerState(
  trialEndsAt: number | null | undefined,
  now = Date.now()
): TrialBannerState | null {
  if (trialEndsAt == null || !Number.isFinite(trialEndsAt) || trialEndsAt <= 0) {
    return null;
  }
  const daysLeft = Math.ceil((trialEndsAt - now) / MS_PER_DAY);
  if (daysLeft <= 0) return { expired: true, daysLeft: 0 };
  return { expired: false, daysLeft };
}

export function trialBannerMessage(trial: TrialBannerState): string {
  if (trial.expired) return "Your free trial has ended.";
  const unit = trial.daysLeft === 1 ? "day" : "days";
  return `${trial.daysLeft} ${unit} left in your free trial.`;
}

/**
 * Trial has ended and the seller is not marked active yet.
 * `sellers.status` is operational (onboarding/active/paused), not a billing
 * subscription field — treat `active` as "paid / approved" until a dedicated
 * subscription_status exists.
 */
export function trialPaymentOverdue(
  seller: { trialEndsAt?: number; status: string } | null | undefined,
  now = Date.now()
): boolean {
  if (!seller) return false;
  if (seller.status === "active") return false;
  return trialBannerState(seller.trialEndsAt, now)?.expired === true;
}
