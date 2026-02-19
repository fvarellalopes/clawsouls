"use client";

import Link from "next/link";
import { Heart, Github, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto">
      <div className="absolute inset-0 border-t border-purple-500/20" />
      <div className="container mx-auto py-8 px-4 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-purple-300/60">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">
              Forjado com <Heart className="inline h-3 w-3 text-amber-500 mx-1" /> por Clawd
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com/fvarellalopes/clawsouls" 
              target="_blank"
              className="text-purple-300/60 hover:text-purple-200 transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link 
              href="https://clawd.ai" 
              target="_blank"
              className="text-purple-300/60 hover:text-purple-200 transition-colors text-sm"
            >
              Clawd.ai
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
