import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const publicPaths = ["/login", "/signup", "/auth/callback"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = request.cookies.get("appointment_app_access_token")?.value;

  // If no token is found and not on a public path, redirect to login
  if (!token) {
    // Save the URL they tried to access for later
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Add the original URL as a query parameter or in session storage
    return NextResponse.redirect(url);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Static files (/_next/*)
     * - Public assets (/public/*)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
