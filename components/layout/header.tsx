"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe } from "lucide-react";
import { useSoulStore } from "@/store/soulStore";
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
  const { isDarkMode, setIsDarkMode } = useSoulStore();

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const locales = [
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "es", name: "Español" },
    { code: "ja", name: "日本語" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 glass supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gradient">ClawSouls</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/presets">{t("presets")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/editor">{t("create")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">{t("about")}</Link>
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc.code} asChild>
                  <Link
                    href={`/${loc.code === "en" ? "" : loc.code}`}
                    locale={loc.code}
                    className={`flex items-center ${locale === loc.code ? "font-semibold" : ""}`}
                  >
                    {loc.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
