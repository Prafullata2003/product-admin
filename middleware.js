import { NextResponse } from "next/server";
// Runs before the page loads: only users with a token cookie can open /products.
export function middleware(req) {
  const hasToken = req.cookies.get("token");
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/products") && !hasToken) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname === "/login" && hasToken) return NextResponse.redirect(new URL("/products", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/products/:path*", "/login"] };
