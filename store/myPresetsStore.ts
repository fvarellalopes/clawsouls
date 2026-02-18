import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SoulState } from "./soulStore";

export interface MyPreset {
  id: string;
  name: string;
  soul: SoulState["soul"];
  savedAt: number;
}

interface MyPresetsStore {
  presets: MyPreset[];
  add: (preset: Omit<MyPreset, "id" | "savedAt">) => void;
  remove: (id: string) => void;
  load: (id: string) => SoulState["soul"] | null;
}

export const useMyPresetsStore = create<MyPresetsStore>()(
  persist(
    (set, get) => ({
      presets: [],
      add: (preset) =>
        set((state) => ({
          presets: [
            ...state.presets,
            {
              ...preset,
              id: crypto.randomUUID(),
              savedAt: Date.now(),
            },
          ],
        })),
      remove: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
        })),
      load: (id) => {
        const preset = get().presets.find((p) => p.id === id);
        return preset ? preset.soul : null;
      },
    }),
    {
      name: "my-presets-storage",
      partialize: (state) => ({ presets: state.presets.slice(-50) }),
    }
  )
);
