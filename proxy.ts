import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/dashboard/default", request.url));
}

export const config = {
  matcher: ["/dashboard", "/"]
};
