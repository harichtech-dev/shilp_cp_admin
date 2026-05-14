import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token");

  const protectedRoutes = [
    "/dashboard",
    "/users",
    "/send",
    "/integrations",
    "/image-template",
    "/video-template",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

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