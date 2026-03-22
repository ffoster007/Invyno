import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

/**
 * Proxy function for route protection and JWT token verification
 * Note: Edge runtime doesn't support Prisma, so we only verify JWT tokens here.
 * Token blacklist checking is handled in API routes.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/", // Landing page
    "/landing", // Landing pages
    "/auth/signin",
    "/auth/signup",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/google",
    "/api/auth/refresh",
    "/api/auth/logout",
  ];

  // Check if route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // For API routes, require Authorization header
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token (blacklist check happens in API routes with Prisma)
    const payload = verifyAccessToken(token);
    if (!payload) {
      // If token is invalid but refresh token exists, let API route handle it
      if (refreshToken) {
        return NextResponse.next();
      }
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId.toString());
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    // For page routes, check if it's a protected route
    const protectedPageRoutes = ["/components", "/dashboard"];
    const isProtectedRoute = protectedPageRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
      // Protected page routes - require authentication
      if (!token && !refreshToken) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
      // If no token but refresh token exists, let client handle it
      if (!token && refreshToken) {
        return NextResponse.next();
      }

      // Verify token if present
      if (token) {
        const payload = verifyAccessToken(token);
        if (!payload && !refreshToken) {
          return NextResponse.redirect(new URL("/auth/signin?error=invalid_token", request.url));
        }
      }
    }
    // For public page routes (landing, auth pages), allow through
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
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
