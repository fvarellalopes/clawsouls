"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Palette, Check } from "lucide-react";
import { motion } from "framer-motion";

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
          className="text-purple-300 hover:text-purple-100"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a0f2e] border-purple-500/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider flex items-center gap-2">
            <Palette className="h-5 w-5 text-amber-400" />
            {t("changeTheme")}
          </DialogTitle>
          <DialogDescription>{t("changeThemeDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTheme(theme.id);
                setOpen(false);
              }}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                themeId === theme.id
                  ? "border-amber-400/60 bg-amber-500/5"
                  : "border-purple-500/15 hover:border-purple-400/30 bg-[#0d0820]/50"
              }`}
            >
              {themeId === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-[#0a0514]" />
                </motion.div>
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
                <span className="font-display text-sm tracking-wide text-purple-100">
                  {t(theme.nameKey)}
                </span>
              </div>
              <p className="text-[11px] text-purple-400/50 leading-tight">
                {t(theme.descriptionKey)}
              </p>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
