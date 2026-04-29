"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Left — Brand */}
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-foreground">ClawSouls</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Visual SOUL.md editor for OpenClaw</span>
        </div>

        {/* Center — Links */}
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <a
            href="https://github.com/fvarellalopes/clawsouls"
            target="_blank"
            rel="noopener"
            className="hover:text-foreground transition-colors duration-150"
          >
            GitHub
          </a>
          <a
            href="https://github.com/fvarellalopes/clawsouls/blob/main/brainstorm.md"
            target="_blank"
            rel="noopener"
            className="hover:text-foreground transition-colors duration-150"
          >
            Brainstorm
          </a>
          <a
            href="https://github.com/fvarellalopes/clawsouls/blob/main/PLAN.md"
            target="_blank"
            rel="noopener"
            className="hover:text-foreground transition-colors duration-150"
          >
            PLAN
          </a>
        </nav>

        {/* Right — Credit */}
        <span className="text-muted-foreground">
          Made with 🔩 by disconexo
        </span>
      </div>
    </footer>
  );
}
