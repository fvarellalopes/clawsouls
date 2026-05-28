import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NsfwStore {
  /** Whether the user has confirmed they are 18+ */
  ageVerified: boolean;
  /** Whether NSFW mode is actively toggled on */
  nsfwEnabled: boolean;

  /** Confirm age and enable NSFW mode */
  confirmAge: () => void;
  /** Toggle NSFW mode on/off (requires age verification) */
  toggleNsfw: () => void;
  /** Reset everything (for testing or user request) */
  resetNsfw: () => void;
}

export const useNsfwStore = create<NsfwStore>()(
  persist(
    (set, get) => ({
      ageVerified: false,
      nsfwEnabled: false,

      confirmAge: () => {
        set({ ageVerified: true, nsfwEnabled: true });
      },

      toggleNsfw: () => {
        const { ageVerified, nsfwEnabled } = get();
        if (!ageVerified) return; // Must confirm age first
        set({ nsfwEnabled: !nsfwEnabled });
      },

      resetNsfw: () => {
        set({ ageVerified: false, nsfwEnabled: false });
      },
    }),
    {
      name: "clawsouls-nsfw",
      partialize: (state) => ({
        ageVerified: state.ageVerified,
        nsfwEnabled: state.nsfwEnabled,
      }),
    }
  )
);
