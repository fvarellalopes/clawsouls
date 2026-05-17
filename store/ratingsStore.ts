import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PresetRating {
  presetId: string;
  liked: boolean | null;  // true = like, false = dislike, null = no vote
  stars: number;          // 0-5
  timestamp: number;
}

interface RatingsState {
  ratings: Record<string, PresetRating>;

  // Like/Dislike
  toggleLike: (presetId: string) => void;
  setDislike: (presetId: string) => void;
  clearVote: (presetId: string) => void;

  // Star rating
  setStars: (presetId: string, stars: number) => void;

  // Getters
  getLike: (presetId: string) => boolean | null;
  getStars: (presetId: string) => number;

  // Aggregate (from API)
  aggregateScores: Record<string, { likes: number; dislikes: number; avgStars: number; totalRatings: number }>;
  setAggregateScores: (scores: Record<string, { likes: number; dislikes: number; avgStars: number; totalRatings: number }>) => void;
  getAggregate: (presetId: string) => { likes: number; dislikes: number; avgStars: number; totalRatings: number };
}

export const useRatingsStore = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: {},
      aggregateScores: {},

      toggleLike: (presetId: string) => {
        set((state) => {
          const existing = state.ratings[presetId];
          const wasLiked = existing?.liked === true;
          return {
            ratings: {
              ...state.ratings,
              [presetId]: {
                presetId,
                liked: wasLiked ? null : true,
                stars: existing?.stars ?? 0,
                timestamp: Date.now(),
              },
            },
          };
        });
      },

      setDislike: (presetId: string) => {
        set((state) => {
          const existing = state.ratings[presetId];
          const wasDisliked = existing?.liked === false;
          return {
            ratings: {
              ...state.ratings,
              [presetId]: {
                presetId,
                liked: wasDisliked ? null : false,
                stars: existing?.stars ?? 0,
                timestamp: Date.now(),
              },
            },
          };
        });
      },

      clearVote: (presetId: string) => {
        set((state) => ({
          ratings: {
            ...state.ratings,
            [presetId]: {
              presetId,
              liked: null,
              stars: state.ratings[presetId]?.stars ?? 0,
              timestamp: Date.now(),
            },
          },
        }));
      },

      setStars: (presetId: string, stars: number) => {
        set((state) => {
          const existing = state.ratings[presetId];
          return {
            ratings: {
              ...state.ratings,
              [presetId]: {
                presetId,
                liked: existing?.liked ?? null,
                stars: Math.max(0, Math.min(5, stars)),
                timestamp: Date.now(),
              },
            },
          };
        });
      },

      getLike: (presetId: string) => {
        return get().ratings[presetId]?.liked ?? null;
      },

      getStars: (presetId: string) => {
        return get().ratings[presetId]?.stars ?? 0;
      },

      setAggregateScores: (scores) => {
        set({ aggregateScores: scores });
      },

      getAggregate: (presetId: string) => {
        return get().aggregateScores[presetId] ?? { likes: 0, dislikes: 0, avgStars: 0, totalRatings: 0 };
      },
    }),
    {
      name: "clawsouls-ratings",
      partialize: (state) => ({ ratings: state.ratings }),
    }
  )
);
