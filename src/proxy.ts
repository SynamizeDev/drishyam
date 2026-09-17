import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.hostname ||
    "";

  // Normalize host: strip port and convert to lowercase
  const host = hostname.split(":")[0].toLowerCase();

  // Check if requesting via the dedicated admin subdomain
  // Exact production hostname: admin.drishyamopticals.in (and admin.localhost for local dev)
  const isAdminSubdomain =
    host === "admin.drishyamopticals.in" ||
    host === "admin.localhost";

  if (isAdminSubdomain) {
    const { pathname, search } = request.nextUrl;

    // Avoid double prefixing if the path already starts with /admin
    if (pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL(`${pathname}${search}`, request.url));
    }

    // Rewrite root and subpaths to the internal /admin routes
    // e.g. / -> /admin, /login -> /admin/login
    const rewritePath = pathname === "/" ? "/admin" : `/admin${pathname}`;
    return NextResponse.rewrite(new URL(`${rewritePath}${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static public media/assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};
