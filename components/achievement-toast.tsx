"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievementsStore, achievements } from "@/store/achievementsStore";
import { Trophy, X } from "lucide-react";

export function AchievementToast() {
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

  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#1a0f2e]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-amber-500/10">
            <div className="text-4xl">{achievement.emoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Achievement Unlocked!
                </span>
              </div>
              <div className="text-lg font-bold text-purple-100 font-display">
                {achievement.name}
              </div>
              <div className="text-sm text-purple-300/60">
                {achievement.description}
              </div>
            </div>
            <button
              onClick={() => {
                setVisible(false);
                clearNewAchievement();
              }}
              className="text-purple-400/40 hover:text-purple-300 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
