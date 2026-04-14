import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/user/edit", "/spots/new"];

function isProtectedRoute(pathname: string): boolean {
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) return true;
  // /spots/:id/edit
  if (/^\/spots\/[^/]+\/edit$/.test(pathname)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth.token")?.value;

  if (isProtectedRoute(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/user/edit", "/spots/new", "/spots/:id/edit"]
};
