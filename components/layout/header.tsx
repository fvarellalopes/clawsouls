"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface HeaderProps {
  locale: string;
  messages: any;
}

export function Header({ locale, messages }: HeaderProps) {
  const t = useTranslations("common");

  const navLinks = [
    { href: `/${locale}/editor`, label: "Editor" },
    { href: `/${locale}/presets`, label: "Presets" },
    { href: `/${locale}/library`, label: "Library" },
    { href: `/${locale}/docs`, label: "Docs" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
      {/* Left — Logo + Nav */}
      <div className="flex items-center gap-8">
        <Link href={`/${locale}`} className="text-2xl font-bold tracking-tighter text-[#facc15] font-['Space_Grotesk']">
          ClawSouls
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-['Space_Grotesk'] tracking-tight text-sm uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 px-2 py-1 rounded"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        <button
          className="text-white/60 hover:text-[#facc15] transition-colors"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-xl">
            settings
          </span>
        </button>
        <button
          className="text-white/60 hover:text-[#facc15] transition-colors"
          aria-label="Account"
        >
          <span className="material-symbols-outlined text-xl">
            account_circle
          </span>
        </button>
        <Link
          href={`/${locale}/editor`}
          className="hidden md:flex items-center px-4 py-2 bg-[#facc15] text-[#3c2f00] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.1em] rounded hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all"
        >
          Connect Terminal
        </Link>
      </div>
    </nav>
  );
}
