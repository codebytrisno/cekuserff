import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token")?.value
    || request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = !!sessionCookie;

  const protectedPaths = ["/bookmarks", "/compare", "/player", "/settings", "/history"];

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (pathname.startsWith("/auth") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg).*)"],
};
