import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "ClawSouls — Unleash the Soul of AI",
  description: "The ultimate visual editor for OpenClaw SOUL.md personalities. Architect, refine, and deploy complex AI identities with unprecedented precision.",
  keywords: ["openclaw", "ai personality", "soul.md", "agent customization", "ai character creator", "visual editor"],
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
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
