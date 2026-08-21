import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isAdminRoute && !isDashboardRoute) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const loginPath = isAdminRoute ? "/admin/login" : "/login";
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && session.role !== "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
