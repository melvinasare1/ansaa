import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Expose the request pathname to store layouts so chrome can resolve `/store/{template}/{slug}`. */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/store/:path*"],
};
