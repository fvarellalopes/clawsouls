"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface HeaderProps {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: HeaderProps) {
  const t = useTranslations("common");

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
      <div className="absolute inset-0 bg-[#0a0514]/80 backdrop-blur-xl border-b border-purple-500/10" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-wider font-display">
            <span className="text-gradient">Claw</span>
            <span className="text-gradient-gold">Souls</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="text-purple-300/60 hover:text-purple-100 hover:bg-purple-500/10 rounded-lg">
            <Link href="/presets">{t("presets")}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-purple-300/60 hover:text-purple-100 hover:bg-purple-500/10 rounded-lg">
            <Link href="/quiz">Quiz</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-purple-300/60 hover:text-purple-100 hover:bg-purple-500/10 rounded-lg">
            <Link href="/achievements">Achievements</Link
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-purple-300/60 hover:text-purple-100 hover:bg-purple-500/10 rounded-lg">
            <Link href="/editor">{t("create")}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-purple-300/50 hover:text-purple-100 hover:bg-purple-500/10 rounded-xl">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a0f2e] border-purple-500/20 rounded-xl">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc.code} asChild>
                  <Link
                    href={`/${loc.code}`}
                    className={`text-purple-200/70 hover:text-purple-100 cursor-pointer rounded-lg ${
                      locale === loc.code ? "text-amber-400 font-semibold bg-purple-500/10" : ""
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
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-0 shadow-lg shadow-purple-500/20 rounded-xl"
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
