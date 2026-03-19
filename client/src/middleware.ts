import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard routes require auth - we check client-side since JWT is in localStorage
  // This middleware only handles redirects for basic patterns
  if (pathname.startsWith("/dashboard")) {
    // Client-side auth check will handle the actual protection
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
