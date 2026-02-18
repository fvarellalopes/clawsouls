import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SoulState, SoulPreset } from "./soulStore";

interface HistoryState {
  past: SoulState["soul"][];
  future: SoulState["soul"][];
  maxSize: number;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      past: [],
      future: [],
      maxSize: 50,

      push: (soul: SoulState["soul"]) => {
        const { past, maxSize } = get();
        const newPast = [...past, soul];
        if (newPast.length > maxSize) {
          newPast.shift();
        }
        set({ past: newPast, future: [] });
      },

      undo: (current: SoulState["soul"]) => {
        const { past, future } = get();
        if (past.length === 0) return current;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        const newFuture = [current, ...future];

        set({ past: newPast, future: newFuture });
        return previous;
      },

      redo: (current: SoulState["soul"]) => {
        const { past, future } = get();
        if (future.length === 0) return current;

        const next = future[0];
        const newPast = [...past, current];
        const newFuture = future.slice(1);

        set({ past: newPast, future: newFuture });
        return next;
      },

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      clear: () => set({ past: [], future: [] }),
    }),
    {
      name: "history-storage",
      partialize: (state) => ({
        past: state.past.slice(-10), // keep only last 10 in storage
        future: state.future.slice(0, 5),
      }),
    }
  )
);
