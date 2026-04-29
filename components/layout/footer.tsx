"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-foreground">ClawSouls</span>
          <span>·</span>
          <span>Visual SOUL.md Editor</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/fvarellalopes/clawsouls"
            target="_blank"
            rel="noopener"
            className="hover:text-foreground transition-colors duration-150"
          >
            {t("github")}
          </a>
          <Link
            href="/editor"
            className="hover:text-foreground transition-colors duration-150"
          >
            {t("editor")}
          </Link>
          <Link
            href="/presets"
            className="hover:text-foreground transition-colors duration-150"
          >
            {t("presets")}
          </Link>
        </div>
        <span>{t("builtWith")} · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
