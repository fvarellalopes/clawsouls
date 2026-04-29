"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Palette, Check } from "lucide-react";


export function ThemeSelector() {
  const t = useTranslations("editor");
  const { themeId, setTheme, getAllThemes } = useThemeStore();
  const [open, setOpen] = useState(false);
  const themes = getAllThemes();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={t("changeTheme")}
          aria-label={t("changeTheme")}
          className="text-muted-fg hover:text-fg"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider flex items-center gap-2">
            <Palette className="h-5 w-5 text-accent" />
            {t("changeTheme")}
          </DialogTitle>
          <DialogDescription>{t("changeThemeDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id);
                setOpen(false);
              }}
              className={`relative p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] active:scale-[0.98] ${
                themeId === theme.id
                  ? "border-accent/60 bg-accent/5"
                  : "border-border hover:border-primary/30 bg-surface/50"
              }`}
            >
              {themeId === theme.id && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-accent-fg" />
                </div>
              )}

              {/* Color preview dots */}
              <div className="flex gap-1.5 mb-3">
                <div
                  className="w-5 h-5 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.preview.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.preview.accent }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.preview.background }}
                />
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{theme.emoji}</span>
                <span className="font-display text-sm tracking-wide text-fg">
                  {t(theme.nameKey)}
                </span>
              </div>
              <p className="text-[11px] text-subtle-fg leading-tight">
                {t(theme.descriptionKey)}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
