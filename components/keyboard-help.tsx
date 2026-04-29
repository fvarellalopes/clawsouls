"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function KeyboardHelp() {
  const t = useTranslations("keyboard");
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: ["Ctrl", "Z"], action: t("undo") },
    { keys: ["Ctrl", "Y"], action: t("redo") },
    { keys: ["Ctrl", "Shift", "Z"], action: t("redoAlt") },
    { keys: ["Enter"], action: t("addItem") },
  ];

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

  if (!open) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 z-50 w-72 animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-fg font-display">{t("title")}</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-fg hover:text-fg" aria-label="Close keyboard shortcuts">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div key={s.action} className="flex items-center justify-between">
              <span className="text-sm text-muted-fg">{s.action}</span>
              <div className="flex gap-1">
                {s.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-0.5 text-[10px] font-mono bg-primary/5 border border-border rounded text-muted-fg"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-fg mt-4 text-center">
          Press <kbd className="px-1 py-0.5 bg-primary/5 rounded text-muted-fg">?</kbd> {t("pressToToggle")}
        </p>
      </div>
    </div>
  );
}
