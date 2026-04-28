"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { keys: ["Ctrl", "Z"], action: "Undo" },
  { keys: ["Ctrl", "Y"], action: "Redo" },
  { keys: ["Ctrl", "Shift", "Z"], action: "Redo (alt)" },
  { keys: ["Enter"], action: "Add item (in inputs)" },
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-24 md:bottom-8 right-4 z-50 w-72"
        >
          <div className="bg-[#1a0f2e]/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-bold text-purple-100 font-display">Keyboard Shortcuts</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-purple-400/40 hover:text-purple-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.action} className="flex items-center justify-between">
                  <span className="text-sm text-purple-200/60">{s.action}</span>
                  <div className="flex gap-1">
                    {s.keys.map((key) => (
                      <kbd
                        key={key}
                        className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 rounded text-purple-300/60"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-purple-400/30 mt-4 text-center">
              Press <kbd className="px-1 py-0.5 bg-purple-500/10 rounded text-purple-300/50">?</kbd> to toggle
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
