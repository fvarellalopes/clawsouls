"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Edit3, LayoutGrid, Bookmark, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const t = useTranslations("mobileNav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const cleanPath = pathname?.replace(/^\/(en|pt|es|ja|fr|de|zh)/, "") || "/";
  const normalizedPath = cleanPath === "" ? "/" : cleanPath;

  const links = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/editor", label: tCommon("create"), icon: Edit3 },
    { href: "/presets", label: t("presets"), icon: LayoutGrid },
    { href: "/soulgate", label: tCommon("soulgate"), icon: Shield },
    { href: "/my-presets", label: t("myPresets"), icon: Bookmark },
  ];

  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-3 mb-3 rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-around px-1 py-2">
          {links.map((link) => {
            const isActive =
              normalizedPath === link.href ||
              (link.href !== "/" && normalizedPath.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10 border border-border" />
                )}
                <Icon className="h-5 w-5 relative z-10" />
                <span className="text-[9px] font-medium mt-0.5 relative z-10 tracking-wide truncate max-w-[56px] text-center">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
