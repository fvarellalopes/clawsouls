"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  
  return (
    <footer className="w-full py-12 bg-[#09090b] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left — Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-[#facc15] font-bold font-['Space_Grotesk'] text-xs tracking-[0.2em] uppercase">
            © 2024 CLAWSOULS TERMINAL // {t("systemStatus")}
          </span>
        </div>

        {/* Right — Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://github.com/fvarellalopes/clawsouls"
            target="_blank"
            rel="noopener"
            className="font-['Space_Grotesk'] text-[10px] tracking-[0.2em] uppercase text-neutral-600 hover:text-[#facc15] transition-all opacity-70 hover:opacity-100"
          >
            {t("github")}
          </a>
          <a
            href="https://discord.com/invite/clawd"
            target="_blank"
            rel="noopener"
            className="font-['Space_Grotesk'] text-[10px] tracking-[0.2em] uppercase text-neutral-600 hover:text-[#facc15] transition-all opacity-70 hover:opacity-100"
          >
            {t("discord")}
          </a>
          <Link
            href="/terms"
            className="font-['Space_Grotesk'] text-[10px] tracking-[0.2em] uppercase text-neutral-600 hover:text-[#facc15] transition-all opacity-70 hover:opacity-100"
          >
            {t("termsOfService")}
          </Link>
          <Link
            href="/privacy"
            className="font-['Space_Grotesk'] text-[10px] tracking-[0.2em] uppercase text-neutral-600 hover:text-[#facc15] transition-all opacity-70 hover:opacity-100"
          >
            {t("privacyProtocol")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
