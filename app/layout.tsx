import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClawSouls — Create Your OpenClaw Soul",
  description: "Design, customize, and share AI personality profiles. The visual SOUL.md editor for OpenClaw agents.",
  keywords: ["openclaw", "ai personality", "soul.md", "agent customization", "ai character creator"],
  authors: [{ name: "ClawSouls" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "ClawSouls — Create Your OpenClaw Soul",
    description: "Design, customize, and share AI personality profiles. The visual SOUL.md editor for OpenClaw agents.",
    url: "https://clawsouls.hub",
    siteName: "ClawSouls",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawSouls — Create Your OpenClaw Soul",
    description: "Design, customize, and share AI personality profiles. The visual SOUL.md editor for OpenClaw agents.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ClawSouls",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
