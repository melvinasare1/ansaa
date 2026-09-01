export type GaEventParams = Record<string, string | number | boolean | undefined>;

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;
const DEFAULT_GA_MEASUREMENT_ID = "G-6SNH1NCQ3Z";

export function getGaMeasurementId(): string | null {
  const id =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? DEFAULT_GA_MEASUREMENT_ID;
  if (!id || !GA_MEASUREMENT_ID_PATTERN.test(id)) return null;
  return id;
}

export function trackGaEvent(name: string, params?: GaEventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
