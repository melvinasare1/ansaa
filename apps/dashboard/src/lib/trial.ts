export const TRIAL_LENGTH_DAYS = 30;
export const TRIAL_TIME_ZONE = "Africa/Accra";
/** Bumped so a trial reset is visible even if the seller dismissed an older banner. */
export const TRIAL_BANNER_DISMISS_KEY = "ansaa-trial-banner-dismissed-v2";
export const TRIAL_EXPIRY_MODAL_DISMISS_KEY = "ansaa-trial-expiry-modal-dismissed-v2";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type TrialBannerState = {
  expired: boolean;
  daysLeft: number;
};

export function trialEndsAtFromNow(now = Date.now()): number {
  return now + TRIAL_LENGTH_DAYS * MS_PER_DAY;
}

function calendarDateKey(ms: number, timeZone = TRIAL_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

function utcMsFromDateKey(key: string): number {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Whole calendar days from today to the trial end date (Ghana). Negative once that date has passed. */
export function trialCalendarDaysLeft(
  trialEndsAt: number,
  now = Date.now()
): number {
  const end = utcMsFromDateKey(calendarDateKey(trialEndsAt));
  const today = utcMsFromDateKey(calendarDateKey(now));
  return Math.round((end - today) / MS_PER_DAY);
}

/** Null when the seller has no trial (trial_ends_at unset). Drops by 1 at midnight Africa/Accra. */
export function trialBannerState(
  trialEndsAt: number | null | undefined,
  now = Date.now()
): TrialBannerState | null {
  if (trialEndsAt == null || !Number.isFinite(trialEndsAt) || trialEndsAt <= 0) {
    return null;
  }
  const daysUntilEndDate = trialCalendarDaysLeft(trialEndsAt, now);
  if (daysUntilEndDate < 0) return { expired: true, daysLeft: 0 };
  return { expired: false, daysLeft: Math.max(daysUntilEndDate, 1) };
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
