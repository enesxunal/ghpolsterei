import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/leistungsangebot" || pathname === "/leistungsangebot/") {
    return NextResponse.redirect(new URL("/leistungen", request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/leistungsangebot", "/leistungsangebot/"],
};
