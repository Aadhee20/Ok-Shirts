import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (isLoggedIn && role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn || role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const protectedRoutes = ["/checkout", "/orders", "/wishlist", "/account", "/measurements"];
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && (!isLoggedIn || role !== "customer")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/orders/:path*", "/wishlist", "/account", "/measurements"],
};
