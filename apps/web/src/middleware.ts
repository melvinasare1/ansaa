import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isReservedStoreSubdomain,
  STOREFRONT_ROOT_DOMAIN,
} from "@ansaa/shared/store-domain";
import { parseStorefrontTemplate } from "@ansaa/shared/types";

const APEX_HOSTS = new Set([STOREFRONT_ROOT_DOMAIN, `www.${STOREFRONT_ROOT_DOMAIN}`]);

function hostnameOf(request: NextRequest): string {
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  return host.split(":")[0]?.toLowerCase() ?? "";
}

function withPathnameHeader(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return requestHeaders;
}

function passThrough(request: NextRequest) {
  return NextResponse.next({
    request: { headers: withPathnameHeader(request, request.nextUrl.pathname) },
  });
}

function sellerSubdomain(hostname: string): string | null {
  const suffix = `.${STOREFRONT_ROOT_DOMAIN}`;
  if (!hostname.endsWith(suffix)) return null;
  const subdomain = hostname.slice(0, -suffix.length);
  if (!subdomain || subdomain.includes(".")) return null;
  return subdomain;
}

function shouldSkipSellerRewrite(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/store/")
  );
}

async function lookupSellerTemplate(storeSlug: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const endpoint = new URL("/rest/v1/sellers", url);
  endpoint.searchParams.set("select", "template,store_slug");
  endpoint.searchParams.set("store_slug", `eq.${storeSlug}`);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!response.ok) return null;

  const rows = (await response.json()) as Array<{ template?: unknown }>;
  const template = rows[0]?.template;
  return typeof template === "string" && template ? template : null;
}

export async function middleware(request: NextRequest) {
  const hostname = hostnameOf(request);

  if (APEX_HOSTS.has(hostname) || !hostname.endsWith(`.${STOREFRONT_ROOT_DOMAIN}`)) {
    return passThrough(request);
  }

  const storeSlug = sellerSubdomain(hostname);
  if (!storeSlug || isReservedStoreSubdomain(storeSlug)) {
    return passThrough(request);
  }

  const pathname = request.nextUrl.pathname;
  if (shouldSkipSellerRewrite(pathname)) {
    return passThrough(request);
  }

  const template = await lookupSellerTemplate(storeSlug);
  if (!template) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = "/__host-not-found";
    return NextResponse.rewrite(notFoundUrl, {
      request: { headers: withPathnameHeader(request, "/__host-not-found") },
    });
  }

  const rest = pathname === "/" ? "" : pathname;
  const rewritePath = `/store/${parseStorefrontTemplate(template)}/${storeSlug}${rest}`;
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = rewritePath;

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: withPathnameHeader(request, rewritePath) },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)"],
};
