'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-yellow-400 font-bold text-xl tracking-tight">
          ClawSouls
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {['Editor', 'Presets', 'Library', 'Docs'].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="uppercase font-display text-sm text-gray-300 hover:text-yellow-400 transition-colors"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Right Side: Icons + CTA */}
        <div className="flex items-center gap-4">
          {/* Material Symbols Icons */}
          <button className="text-gray-300 hover:text-yellow-400 transition-colors" aria-label="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="text-gray-300 hover:text-yellow-400 transition-colors" aria-label="Account">
            <span className="material-symbols-outlined">account_circle</span>
          </button>

          {/* CTA Button */}
          <Link
            href="/connect"
            className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors text-sm uppercase"
          >
            Connect Terminal
          </Link>
        </div>
      </div>
    </header>
  );
}
