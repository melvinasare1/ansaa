"use client";

import { useEffect, useState } from "react";
import { trialBannerState, trialPaymentOverdue, type TrialBannerState } from "@/lib/trial";

const HOUR_MS = 60 * 60 * 1000;

/** Recompute remaining trial days on the client so the count drops each calendar day. */
export function useLiveTrial(
  trialEndsAt: number | null | undefined,
  status: string | null | undefined
): { trial: TrialBannerState | null; showExpiryModal: boolean } {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const interval = window.setInterval(tick, HOUR_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const trial = trialBannerState(trialEndsAt, now);
  const paid = status === "active";
  return {
    trial: trial?.expired && paid ? null : trial,
    showExpiryModal: trialPaymentOverdue(
      trialEndsAt == null || !status ? null : { trialEndsAt, status },
      now
    ),
  };
}
