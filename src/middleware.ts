// middleware.ts - Route-level authentication guard for the admin app.
// Runs on matching routes (see config.matcher) and blocks unauthenticated
// access by redirecting to /login when no token cookie is present.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MIDDLEWARE FUNCTION - Guards protected routes.
 * The presence of the auth token cookie is checked before the request
 * proceeds; missing tokens are redirected to /login.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Read the auth token from the request cookie

  // Protected routes that are only accessible after login
  const protectedRoutes = [
    "/dashboard",
    "/users",
    "/send",
    "/integrations",
    "/image-template",
    "/video-template",
  ];

  // Check whether the current route matches a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If a protected route has no token, redirect to the login page
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Everything is fine - allow the request to continue
  return NextResponse.next();
}

/**
 * CONFIG - Defines which routes run through the middleware.
 * Only the matcher patterns below are checked by this middleware.
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/send/:path*",
    "/integrations/:path*",
    "/image-template/:path*",
    "/video-template/:path*",
  ],
};