"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Edit3, LayoutGrid, Bookmark, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MobileNav() {
  const t = useTranslations("mobileNav");
  const pathname = usePathname();

  // Strip locale prefix for matching
  const cleanPath = pathname?.replace(/^\/(en|pt|es|ja|fr|de|zh)/, "") || "/";
  const normalizedPath = cleanPath === "" ? "/" : cleanPath;

  const links = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/editor", label: t("editor"), icon: Edit3 },
    { href: "/presets", label: t("presets"), icon: LayoutGrid },
    { href: "/my-presets", label: t("myPresets"), icon: Bookmark },
    { href: "/quiz", label: "Quiz", icon: Sparkles },
    { href: "/achievements", label: t("achievements"), icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-3 mb-3 rounded-2xl bg-[#0d0820]/90 backdrop-blur-xl border border-purple-500/15 shadow-2xl shadow-purple-900/30">
        <div className="flex items-center justify-around px-2 py-2">
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
                  "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-amber-400"
                    : "text-purple-400/40 hover:text-purple-200/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 rounded-xl bg-purple-500/10 border border-purple-500/15"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 relative z-10" />
                <span className="text-[10px] font-medium mt-0.5 relative z-10 tracking-wide">
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
