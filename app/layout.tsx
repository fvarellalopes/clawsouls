import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clawsouls.vercel.app'),
  title: "ClawSouls — Unleash the Soul of AI",
  description:
    "The ultimate visual editor for OpenClaw SOUL.md personalities. Architect, refine, and deploy complex AI identities with unprecedented precision.",
  keywords: [
    "openclaw",
    "ai personality",
    "soul.md",
    "agent customization",
    "ai character creator",
    "visual editor",
  ],
  authors: [{ name: "ClawSouls" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "ClawSouls — Create Your OpenClaw Soul",
    description:
      "Design, customize, and share AI personality profiles. The visual SOUL.md editor for OpenClaw agents.",
    url: "https://clawsouls.hub",
    siteName: "ClawSouls",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ClawSouls — Visual SOUL.md Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawSouls — Create Your OpenClaw Soul",
    description:
      "Design, customize, and share AI personality profiles. The visual SOUL.md editor for OpenClaw agents.",
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
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
