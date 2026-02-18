import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

export default createMiddleware({
  locales: ["en", "pt", "es", "ja"],
  defaultLocale: "en",
  localePrefix: "as-needed",
}).middleware;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*|favicon.ico).*)"],
};
