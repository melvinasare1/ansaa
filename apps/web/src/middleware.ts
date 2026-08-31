import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isPlatformPassThroughHost,
  normalizeStoreHost,
} from "@ansaa/shared/store-domain";
import { parseStorefrontTemplate } from "@ansaa/shared/types";

function hostnameOf(request: NextRequest): string {
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  return normalizeStoreHost(host);
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

function shouldSkipSellerRewrite(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/store/") ||
    pathname.startsWith("/__host-not-found")
  );
}

function hostNotFound(request: NextRequest) {
  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/__host-not-found";
  return NextResponse.rewrite(notFoundUrl, {
    request: { headers: withPathnameHeader(request, "/__host-not-found") },
  });
}

async function lookupSellerByExactDomain(
  hostname: string
): Promise<{ template: string; store_slug: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !hostname) return null;

  const endpoint = new URL("/rest/v1/sellers", url);
  endpoint.searchParams.set("select", "template,store_slug,domain");
  endpoint.searchParams.set("domain", `eq.${hostname}`);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!response.ok) return null;

  const rows = (await response.json()) as Array<{
    template?: unknown;
    store_slug?: unknown;
  }>;
  const row = rows[0];
  const template = row?.template;
  const storeSlug = row?.store_slug;
  if (typeof template !== "string" || !template) return null;
  if (typeof storeSlug !== "string" || !storeSlug) return null;
  return { template, store_slug: storeSlug };
}

export async function middleware(request: NextRequest) {
  const hostname = hostnameOf(request);
  const pathname = request.nextUrl.pathname;

  if (isPlatformPassThroughHost(hostname) || shouldSkipSellerRewrite(pathname)) {
    return passThrough(request);
  }

  const seller = await lookupSellerByExactDomain(hostname);
  if (!seller) {
    return hostNotFound(request);
  }

  const rest = pathname === "/" ? "" : pathname;
  const rewritePath = `/store/${parseStorefrontTemplate(seller.template)}/${seller.store_slug}${rest}`;
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = rewritePath;

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: withPathnameHeader(request, rewritePath) },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)"],
};
