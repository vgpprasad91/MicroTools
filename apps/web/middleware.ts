import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/api/payment",
  "/api/subscription",
];

// Public API paths that don't require authentication
const publicApiPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/send-otp",
  "/api/webhook",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for public API routes
  const isPublicApi = publicApiPaths.some(p => path.startsWith(p));
  if (isPublicApi) {
    return NextResponse.next();
  }
  
  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p));
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") 
    ? authHeader.substring(7)
    : request.cookies.get("auth_token")?.value;

  if (!token) {
    // Redirect to login for browser requests
    if (!path.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Return 401 for API requests
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  // For now, just check if token exists
  // In production, you'd validate the JWT properly
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/payment/:path*",
    "/api/subscription/:path*",
  ],
};