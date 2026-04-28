import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalExports: number;
  totalShares: number;
  presetsUsed: number;
  quizzesTaken: number;
  languagesUsed: string[];
  presetsCreated: number;
  firstExportAt: number | null;
  firstShareAt: number | null;
}

interface AchievementsStore {
  stats: UserStats;
  unlockedIds: string[];
  newAchievement: string | null;

  // Stats updates
  incrementExport: () => void;
  incrementShare: () => void;
  incrementQuiz: () => void;
  incrementPresetsCreated: () => void;
  addLanguageUsed: (locale: string) => void;
  setPresetsUsed: (count: number) => void;

  // Achievement management
  checkAchievements: () => string[];
  clearNewAchievement: () => void;
}

const defaultStats: UserStats = {
  totalExports: 0,
  totalShares: 0,
  presetsUsed: 0,
  quizzesTaken: 0,
  languagesUsed: [],
  presetsCreated: 0,
  firstExportAt: null,
  firstShareAt: null,
};

export const achievements: Achievement[] = [
  {
    id: "first-export",
    name: "First Steps",
    description: "Export your first SOUL.md",
    emoji: "📄",
    condition: (s) => s.totalExports >= 1,
  },
  {
    id: "export-10",
    name: "Soul Smith",
    description: "Export 10 SOUL.md files",
    emoji: "⚒️",
    condition: (s) => s.totalExports >= 10,
  },
  {
    id: "first-share",
    name: "Social Butterfly",
    description: "Share your first creation",
    emoji: "🦋",
    condition: (s) => s.totalShares >= 1,
  },
  {
    id: "share-10",
    name: "Influencer",
    description: "Share 10 times",
    emoji: "📢",
    condition: (s) => s.totalShares >= 10,
  },
  {
    id: "preset-collector",
    name: "Preset Collector",
    description: "Use 10 different presets",
    emoji: "🎒",
    condition: (s) => s.presetsUsed >= 10,
  },
  {
    id: "quiz-taker",
    name: "Self-Discovery",
    description: "Take the personality quiz",
    emoji: "🧠",
    condition: (s) => s.quizzesTaken >= 1,
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Take the quiz 5 times",
    emoji: "🎓",
    condition: (s) => s.quizzesTaken >= 5,
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Use ClawSouls in 3+ languages",
    emoji: "🌍",
    condition: (s) => s.languagesUsed.length >= 3,
  },
  {
    id: "creator",
    name: "Creator",
    description: "Save a custom preset",
    emoji: "🎨",
    condition: (s) => s.presetsCreated >= 1,
  },
  {
    id: "prolific-creator",
    name: "Prolific Creator",
    description: "Save 5 custom presets",
    emoji: "🏭",
    condition: (s) => s.presetsCreated >= 5,
  },
];

export const useAchievementsStore = create<AchievementsStore>()(
  persist(
    (set, get) => ({
      stats: { ...defaultStats },
      unlockedIds: [],
      newAchievement: null,

      incrementExport: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalExports: state.stats.totalExports + 1,
            firstExportAt: state.stats.firstExportAt || Date.now(),
          },
        }));
        get().checkAchievements();
      },

      incrementShare: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalShares: state.stats.totalShares + 1,
            firstShareAt: state.stats.firstShareAt || Date.now(),
          },
        }));
        get().checkAchievements();
      },

      incrementQuiz: () => {
        set((state) => ({
          stats: { ...state.stats, quizzesTaken: state.stats.quizzesTaken + 1 },
        }));
        get().checkAchievements();
      },

      incrementPresetsCreated: () => {
        set((state) => ({
          stats: { ...state.stats, presetsCreated: state.stats.presetsCreated + 1 },
        }));
        get().checkAchievements();
      },

      addLanguageUsed: (locale: string) => {
        set((state) => {
          const langs = state.stats.languagesUsed.includes(locale)
            ? state.stats.languagesUsed
            : [...state.stats.languagesUsed, locale];
          return { stats: { ...state.stats, languagesUsed: langs } };
        });
        get().checkAchievements();
      },

      setPresetsUsed: (count: number) => {
        set((state) => ({
          stats: { ...state.stats, presetsUsed: Math.max(state.stats.presetsUsed, count) },
        }));
        get().checkAchievements();
      },

      checkAchievements: () => {
        const { stats, unlockedIds } = get();
        const newlyUnlocked: string[] = [];

        for (const achievement of achievements) {
          if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
            newlyUnlocked.push(achievement.id);
          }
        }

        if (newlyUnlocked.length > 0) {
          set((state) => ({
            unlockedIds: [...state.unlockedIds, ...newlyUnlocked],
            newAchievement: newlyUnlocked[0],
          }));
        }

        return newlyUnlocked;
      },

      clearNewAchievement: () => set({ newAchievement: null }),
    }),
    {
      name: "achievements-storage",
      partialize: (state) => ({
        stats: state.stats,
        unlockedIds: state.unlockedIds,
      }),
    }
  )
);
