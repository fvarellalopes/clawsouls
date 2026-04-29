"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, Globe, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: HeaderProps) {
  const t = useTranslations("common");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const locales = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-lg border-b border-border" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-4 w-4 text-primary-fg" />
          </div>
          <span className="text-xl font-bold font-display text-fg">
            ClawSouls
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="text-muted-fg hover:text-fg rounded-lg">
            <Link href="/presets">{t("presets")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-muted-fg hover:text-fg rounded-lg">
            <Link href="/quiz">{t("quiz")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-muted-fg hover:text-fg rounded-lg">
            <Link href="/achievements">{t("achievements")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-muted-fg hover:text-fg rounded-lg">
            <Link href="/compare">{t("compare")}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-fg hover:text-fg rounded-xl"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-fg hover:text-fg rounded-lg" aria-label="Change language">
                <Globe className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface border-border rounded-xl">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc.code} asChild>
                  <Link
                    href={`/${loc.code}`}
                    className={`text-fg hover:text-fg cursor-pointer rounded-lg ${
                      locale === loc.code ? "font-semibold bg-primary/10" : ""
                    }`}
                  >
                    <span className="mr-2">{loc.flag}</span>
                    {loc.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            size="sm"
            className="bg-primary text-primary-fg border-0 rounded-lg transition-opacity duration-200 hover:opacity-90"
          >
            <Link href="/editor">
              <Sparkles className="mr-2 h-4 w-4" />
              {t("create")}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
