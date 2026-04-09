import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/user/edit"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth.token")?.value;
  const isProtected = PROTECTED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/user/edit"]
};
