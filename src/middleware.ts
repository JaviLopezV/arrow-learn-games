import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/es", request.url));
  }
  if (
    request.nextUrl.pathname === "/games" ||
    request.nextUrl.pathname.startsWith("/games/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/es${url.pathname}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/games/:path*"] };
