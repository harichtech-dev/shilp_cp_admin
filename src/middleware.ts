import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * MIDDLEWARE FUNCTION - Request check karne ke liye
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Cookie se token nikala

  // Protected routes jo login ke baad accessible hain
  const protectedRoutes = [
    "/dashboard",
    "/users",
    "/send",
    "/integrations",
    "/image-template",
    "/video-template",
  ];

  // Check karte hain ki current route protected hai ya nahi
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Agar protected route hai aur token nahi hai to login par redirect
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Sab theek hai to next request allow kar do
  return NextResponse.next();
}

/**
 * CONFIG - Ye define karta hai ki middleware kaun kaun routes par run ho
 * Matcher mein diye routes par hi ye middleware check karega
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