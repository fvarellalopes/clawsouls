import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "pt", "es", "ja", "fr", "de", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*|favicon.ico).*)"],
};
