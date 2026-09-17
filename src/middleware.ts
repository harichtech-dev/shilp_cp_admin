import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MIDDLEWARE FUNCTION - Protect authenticated routes.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Read the token from the cookie.

  // Routes that require authentication.
  const protectedRoutes = [
    "/dashboard",
    "/users",
    "/send",
    "/integrations",
    "/image-template",
    "/video-template",
  ];

  // Check whether the current route is protected.
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated requests to login.
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow authenticated requests to continue.
  return NextResponse.next();
}

/**
 * CONFIG - Define which routes are handled by the middleware.
 * The middleware runs only for routes listed in the matcher.
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