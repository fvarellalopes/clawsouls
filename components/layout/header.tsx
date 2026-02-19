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

interface HeaderProps {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: HeaderProps) {
  const t = useTranslations("common");

  const locales = [
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "es", name: "Español" },
    { code: "ja", name: "日本語" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 glass border-b border-purple-500/20" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-wider">
            <span className="text-gradient">Claw</span>
            <span className="text-gradient-gold">Souls</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="text-purple-200 hover:text-purple-100 hover:bg-purple-500/10"
          >
            <Link href="/presets">{t("presets")}</Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="text-purple-200 hover:text-purple-100 hover:bg-purple-500/10"
          >
            <Link href="/editor">{t("create")}</Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="text-purple-200 hover:text-purple-100 hover:bg-purple-500/10"
          >
            <Link href="/about">{t("about")}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/10"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-purple-950 border-purple-500/30">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc.code} asChild>
                  <Link
                    href={`/${loc.code === "en" ? "" : loc.code}`}
                    locale={loc.code}
                    className={`text-purple-200 hover:text-purple-100 ${locale === loc.code ? "text-amber-400 font-semibold" : ""}`}
                  >
                    {loc.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            asChild
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-0 shadow-lg shadow-purple-500/20"
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
