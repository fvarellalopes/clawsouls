"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useNsfwStore } from "@/store/nsfwStore";
import { applyTheme, getThemeById } from "@/lib/themes";
import { AgeGateModal } from "@/components/age-gate-modal";

const LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function Header() {
  const t = useTranslations("common");
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = (params?.locale as string) || "en";
  const { themeId, setTheme } = useThemeStore();
  const isDark = themeId !== "paper";
  const { ageVerified, nsfwEnabled, toggleNsfw } = useNsfwStore();

  const [langOpen, setLangOpen] = useState(false);
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = getThemeById(themeId);
    applyTheme(theme);
  }, [themeId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => setTheme(isDark ? "paper" : "cyberpunk");

  const handleNsfwClick = () => {
    if (!ageVerified) {
      setAgeGateOpen(true);
    } else {
      toggleNsfw();
    }
  };

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname?.split("/") || [];
    if (segments.length > 1 && LOCALES.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/"));
    setLangOpen(false);
  };

  const navLinks = [
    { href: `/${activeLocale}/editor`, key: "create" },
    { href: `/${activeLocale}/presets`, key: "presets" },
    { href: `/${activeLocale}/soulgate`, key: "soulgate" },
    { href: `/${activeLocale}/my-presets`, key: "myPresets" },
  ];

  const currentLocale = LOCALES.find((l) => l.code === activeLocale) || LOCALES[0];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
      {/* Left — Logo + Nav */}
      <div className="flex items-center gap-6">
        <Link
          href={`/${activeLocale}`}
          className="text-xl md:text-2xl font-bold tracking-tighter text-primary font-display"
        >
          ClawSouls
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display tracking-tight text-sm uppercase text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200 px-2 py-1 rounded"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer text-sm"
            aria-label="Switch language"
          >
            <span className="text-base">{currentLocale.flag}</span>
            <span className="hidden sm:inline font-mono text-xs uppercase tracking-wide">{currentLocale.code}</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 min-w-[160px] z-50 bg-surface border border-border rounded-lg shadow-xl overflow-hidden animate-fade-in">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                    loc.code === activeLocale
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <span className="text-base">{loc.flag}</span>
                  <span className="font-mono text-xs">{loc.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer p-1.5"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-xl">
            {isDark ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* NSFW Toggle */}
        <button
          onClick={handleNsfwClick}
          className={`transition-colors cursor-pointer p-1.5 ${
            nsfwEnabled
              ? "text-red-500 hover:text-red-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Toggle NSFW mode"
        >
          <span className="material-symbols-outlined text-xl">
            no_adult_content
          </span>
        </button>

        {/* CTA */}
        <Link
          href={`/${activeLocale}/editor`}
          className="hidden md:flex items-center px-4 py-2 bg-primary text-primary-foreground font-display text-xs font-bold uppercase tracking-[0.1em] rounded hover:scale-[1.02] transition-all"
        >
          {t("connectTerminal")}
        </Link>
      </div>

      {/* Age Gate Modal */}
      <AgeGateModal
        isOpen={ageGateOpen}
        onClose={() => setAgeGateOpen(false)}
      />
    </nav>
  );
}
