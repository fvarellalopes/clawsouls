"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {t("footerDescription")}
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("about")}
          </Link>
          <Link href="/presets" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("presets")}
          </Link>
          <Link href="https://docs.openclaw.ai" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            OpenClaw Docs
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} ClawSouls — {t("madeWith")} 🤖💖
        </p>
      </div>
    </footer>
  );
}
