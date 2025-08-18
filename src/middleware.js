import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  console.log("Middleware ishlamoqda:", pathname);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  console.log("Redirecting to dashboard:", pathname);
  const dashboardUrl = new URL("/dashboard", req.url);
  return NextResponse.redirect(dashboardUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};