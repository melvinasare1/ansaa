export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

function withProtocol(raw: string, fallback: string): string {
  const value = raw.replace(/\/$/, "");
  if (!value) return fallback;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

/** Marketing / storefront origin (no trailing slash). */
export function getWebUrl(): string {
  return withProtocol(process.env.NEXT_PUBLIC_WEB_URL ?? "", "http://localhost:3000");
}

/** Seller dashboard origin (no trailing slash). */
export function getDashboardUrl(): string {
  return withProtocol(
    process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "",
    "http://localhost:3001"
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
