"use client";

import { useEffect, useState } from "react";
import { useAchievementsStore, achievements } from "@/store/achievementsStore";
import { Trophy, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function AchievementToast() {
  const t = useTranslations("achievementToast");
  const { newAchievement, clearNewAchievement } = useAchievementsStore();
  const [visible, setVisible] = useState(false);

  const achievement = newAchievement
    ? achievements.find((a) => a.id === newAchievement)
    : null;

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearNewAchievement, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, clearNewAchievement]);

  if (!visible || !achievement) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto animate-fade-up">
      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-surface border border-accent/30 shadow-lg">
        <div className="text-4xl">{achievement.emoji}</div>
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="text-xs text-accent font-bold uppercase tracking-wider">
              {t("achievementUnlocked")}
            </span>
          </div>
          <div className="text-lg font-bold text-fg font-display">
            {achievement.name}
          </div>
          <div className="text-sm text-muted-fg">
            {achievement.description}
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            clearNewAchievement();
          }}
          className="text-muted-fg hover:text-fg ml-2"
          aria-label="Dismiss achievement notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
