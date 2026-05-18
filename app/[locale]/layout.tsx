import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NextIntlClientProvider } from "next-intl";
import { MobileNav } from "@/components/mobile-nav";
import { ErrorBoundary } from "@/components/error-boundary";
import { AchievementToast } from "@/components/achievement-toast";
import { KeyboardHelp } from "@/components/keyboard-help";
import { JsonLd } from "@/components/json-ld";
import { ThemeInitializer } from "@/components/theme-initializer";

const locales = ["en", "pt", "es", "ja", "fr", "de", "zh"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as typeof locales[number])) {
    return {};
  }
  setRequestLocale(locale);
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const typedMessages = messages as Record<string, any>;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clawsouls.vercel.app'),
    title: typedMessages?.home?.heroTitle || "ClawSouls — Create Your OpenClaw Soul",
    description: typedMessages?.home?.heroSubtitle || "Visual SOUL.md editor for OpenClaw agents",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const typedMessages = messages as Record<string, any>;

  return (
    <NextIntlClientProvider locale={locale} messages={typedMessages}>
      <JsonLd />
      <ThemeInitializer />
      <div className="min-h-screen flex flex-col relative">
        <Header locale={locale} />
        <main id="main-content" className="flex-1 pt-16 pb-24 md:pb-0 relative z-10">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
        <MobileNav />
        <AchievementToast />
        <KeyboardHelp />
        <Analytics />
      </div>
    </NextIntlClientProvider>
  );
}
