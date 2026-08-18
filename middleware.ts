import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "bkmsfx-super-secret-key-2026-platform";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("bkmsfx_session")?.value;

  let user: any = null;
  if (sessionCookie) {
    try {
      const { payload } = await jose.jwtVerify(sessionCookie, key, {
        algorithms: ["HS256"],
      });
      user = payload;
    } catch (e) {
      // Token is invalid/expired
    }
  }

  // 1. Guest routes - Redirect authenticated users away from Login/Register
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protected routes - Redirect guests to Login
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isLearn = pathname.startsWith("/learn");

  if (isDashboard || isAdmin || isLearn) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      
      // Delete invalid session cookie if it exists to be clean
      const response = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        response.cookies.delete("bkmsfx_session");
      }
      return response;
    }

    // 3. Admin restrictions - Redirect non-admins away from /admin
    if (isAdmin) {
      const role = user.role;
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/learn/:path*",
    "/login",
    "/register",
  ],
};
