import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NextIntlClientProvider } from "next-intl";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

const locales = ["en", "pt", "es", "ja"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const typedMessages = messages as Record<string, any>;

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <NextIntlClientProvider locale={locale} messages={typedMessages}>
          <div className="min-h-screen flex flex-col">
            <Header locale={locale} messages={typedMessages} />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <Analytics />
            <MobileNav />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
