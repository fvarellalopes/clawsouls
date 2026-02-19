import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Cinzel, Crimson_Pro, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NextIntlClientProvider } from "next-intl";
import { MobileNav } from "@/components/mobile-nav";

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const crimsonPro = Crimson_Pro({ 
  subsets: ["latin"], 
  variable: "--font-body",
  weight: ["300", "400", "500", "600"]
});

const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  weight: ["400", "500"]
});

const locales = ["en", "pt", "es", "ja"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const typedMessages = messages as Record<string, any>;
  return {
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
  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const typedMessages = messages as Record<string, any>;

  return (
    <html lang={locale} className="dark">
      <body className={`${cinzel.variable} ${crimsonPro.variable} ${firaCode.variable}`}>
        <NextIntlClientProvider locale={locale} messages={typedMessages}>
          <div className="min-h-screen flex flex-col relative">
            <Header locale={locale} messages={typedMessages} />
            <main className="flex-1 pb-20 md:pb-0 relative z-10">{children}</main>
            <Footer />
            <Analytics />
            <MobileNav />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
