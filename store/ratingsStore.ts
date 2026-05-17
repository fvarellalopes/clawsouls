import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PresetRating {
  presetId: string;
  liked: boolean | null;
  stars: number;
  timestamp: number;
}

interface RatingsState {
  // Local user votes (optimistic)
  ratings: Record<string, PresetRating>;

  // Anonymous ID for backend
  anonymousId: string;
  getAnonymousId: () => string;

  // Like/Dislike
  toggleLike: (presetId: string) => void;
  setDislike: (presetId: string) => void;
  clearVote: (presetId: string) => void;

  // Star rating
  setStars: (presetId: string, stars: number) => void;

  // Getters
  getLike: (presetId: string) => boolean | null;
  getStars: (presetId: string) => number;

  // Aggregate (from backend)
  aggregateScores: Record<string, { likes: number; dislikes: number; avgStars: number; totalRatings: number }>;
  setAggregateScores: (scores: Record<string, { likes: number; dislikes: number; avgStars: number; totalRatings: number }>) => void;
  getAggregate: (presetId: string) => { likes: number; dislikes: number; avgStars: number; totalRatings: number };

  // Sync with backend
  fetchAggregates: () => Promise<void>;
  syncVote: (presetId: string) => Promise<void>;
}

function generateAnonId(): string {
  const existing = localStorage.getItem("clawsouls-anon-id");
  if (existing) return existing;
  const id = "anon_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem("clawsouls-anon-id", id);
  return id;
}

async function postRating(presetId: string, anonymousId: string, liked: boolean | null, stars: number) {
  try {
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presetId, anonymousId, liked, stars }),
    });
  } catch (err) {
    console.warn("Failed to sync rating to backend:", err);
  }
}

export const useRatingsStore = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: {},
      aggregateScores: {},
      anonymousId: "",

      getAnonymousId: () => {
        let id = get().anonymousId;
        if (!id) {
          id = generateAnonId();
          set({ anonymousId: id });
        }
        return id;
      },

      toggleLike: (presetId: string) => {
        const state = get();
        const existing = state.ratings[presetId];
        const wasLiked = existing?.liked === true;
        const newLiked = wasLiked ? null : true;

        set({
          ratings: {
            ...state.ratings,
            [presetId]: {
              presetId,
              liked: newLiked,
              stars: existing?.stars ?? 0,
              timestamp: Date.now(),
            },
          },
        });

        // Sync to backend
        postRating(presetId, state.getAnonymousId(), newLiked, existing?.stars ?? 0);
      },

      setDislike: (presetId: string) => {
        const state = get();
        const existing = state.ratings[presetId];
        const wasDisliked = existing?.liked === false;
        const newLiked = wasDisliked ? null : false;

        set({
          ratings: {
            ...state.ratings,
            [presetId]: {
              presetId,
              liked: newLiked,
              stars: existing?.stars ?? 0,
              timestamp: Date.now(),
            },
          },
        });

        postRating(presetId, state.getAnonymousId(), newLiked, existing?.stars ?? 0);
      },

      clearVote: (presetId: string) => {
        const state = get();
        set({
          ratings: {
            ...state.ratings,
            [presetId]: {
              presetId,
              liked: null,
              stars: state.ratings[presetId]?.stars ?? 0,
              timestamp: Date.now(),
            },
          },
        });

        postRating(presetId, state.getAnonymousId(), null, state.ratings[presetId]?.stars ?? 0);
      },

      setStars: (presetId: string, stars: number) => {
        const state = get();
        const existing = state.ratings[presetId];
        const clampedStars = Math.max(0, Math.min(5, stars));

        set({
          ratings: {
            ...state.ratings,
            [presetId]: {
              presetId,
              liked: existing?.liked ?? null,
              stars: clampedStars,
              timestamp: Date.now(),
            },
          },
        });

        postRating(presetId, state.getAnonymousId(), existing?.liked ?? null, clampedStars);
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

      fetchAggregates: async () => {
        try {
          const res = await fetch("/api/ratings");
          if (!res.ok) return;
          const json = await res.json();
          if (json.data) {
            set({ aggregateScores: json.data });
          }
        } catch (err) {
          console.warn("Failed to fetch rating aggregates:", err);
        }
      },

      syncVote: async (presetId: string) => {
        const state = get();
        const rating = state.ratings[presetId];
        if (!rating) return;
        postRating(presetId, state.getAnonymousId(), rating.liked, rating.stars);
      },
    }),
    {
      name: "clawsouls-ratings",
      partialize: (state) => ({
        ratings: state.ratings,
        anonymousId: state.anonymousId,
      }),
    }
  )
);
