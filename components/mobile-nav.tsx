"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Edit3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const t = useTranslations("mobileNav");
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: t("home"),
      icon: Home,
    },
    {
      href: "/editor",
      label: t("editor"),
      icon: Edit3,
    },
    {
      href: "/presets",
      label: t("presets"),
      icon: LayoutGrid,
    },
  ];

  return (
    <nav className="mobile-nav">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center touch-target p-2 rounded-lg transition-colors",
              isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
