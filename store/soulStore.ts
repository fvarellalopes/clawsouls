import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useHistoryStore } from "./historyStore";
import { useAutoSaveStore } from "./autoSaveStore";

export interface SoulState {
  soul: {
    name: string;
    creature: string;
    vibe: string;
    emoji: string;
    avatar?: string;
    coreTruths: {
      helpful: boolean;
      opinions: boolean;
      resourceful: boolean;
      trustworthy: boolean;
      respectful: boolean;
    };
    boundaries: {
      private: boolean;
      askBeforeActing: boolean;
      noHalfBaked: boolean;
      notVoiceProxy: boolean;
    };
    vibeStyle: string;
    continuity: boolean;
    // Tone attributes
    humor: number;
    formality: number;
    emojiUsage: number;
    verbosity: number;
    consciousness: number;
    questioning: number;
  };
  isDarkMode: boolean;
  locale: string;

  setSoul: (soul: Partial<SoulState["soul"]>) => void;
  setIsDarkMode: (isDark: boolean) => void;
  setLocale: (locale: string) => void;
  resetSoul: () => void;
  loadPreset: (preset: SoulPreset) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export interface SoulPreset {
  id: string;
  name: string;
  creature: string;
  vibe: string;
  emoji: string;
  avatar?: string;
  coreTruths: {
    helpful: boolean;
    opinions: boolean;
    resourceful: boolean;
    trustworthy: boolean;
    respectful: boolean;
  };
  boundaries: {
    private: boolean;
    askBeforeActing: boolean;
    noHalfBaked: boolean;
    notVoiceProxy: boolean;
  };
  vibeStyle: string;
  description: string;
  tags: string[];
  source: "character" | "custom";
  // Tone attributes (optional)
  humor?: number;
  formality?: number;
  emojiUsage?: number;
  verbosity?: number;
  consciousness?: number;
  questioning?: number;
}

export const useSoulStore = create<SoulState>()(
  persist(
    (set, get) => ({
      soul: {
        name: "",
        creature: "",
        vibe: "",
        emoji: "",
        avatar: undefined,
        coreTruths: {
          helpful: true,
          opinions: true,
          resourceful: true,
          trustworthy: true,
          respectful: true,
        },
        boundaries: {
          private: true,
          askBeforeActing: true,
          noHalfBaked: true,
          notVoiceProxy: true,
        },
        vibeStyle: "concise",
        continuity: true,
        humor: 50,
        formality: 50,
        emojiUsage: 30,
        verbosity: 50,
        consciousness: 50,
        questioning: 30,
      },
      isDarkMode: false,
      locale: "en",

      setSoul: (soul) => {
        const current = get().soul;
        const newSoul = { ...current, ...soul };
        set({ soul: newSoul });
        // Push to history (debounced)
        setTimeout(() => {
          useHistoryStore.getState().push(newSoul);
        }, 100);
        // Trigger auto-save
        setTimeout(() => {
          useAutoSaveStore.getState().setIsSaving(true);
          setTimeout(() => {
            useAutoSaveStore.getState().setLastSaved(Date.now());
            useAutoSaveStore.getState().setIsSaving(false);
          }, 500);
        }, 200);
      },

      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),

      setLocale: (locale) => set({ locale }),

      resetSoul: () => {
        const defaultSoul = {
          name: "",
          creature: "",
          vibe: "",
          emoji: "",
          avatar: undefined,
          coreTruths: {
            helpful: true,
            opinions: true,
            resourceful: true,
            trustworthy: true,
            respectful: true,
          },
          boundaries: {
            private: true,
            askBeforeActing: true,
            noHalfBaked: true,
            notVoiceProxy: true,
          },
          vibeStyle: "concise",
          continuity: true,
          humor: 50,
          formality: 50,
          emojiUsage: 30,
          verbosity: 50,
          consciousness: 50,
          questioning: 30,
        };
        set({ soul: defaultSoul });
        useHistoryStore.getState().push(defaultSoul);
      },

      loadPreset: (preset) => {
        const newSoul: SoulState["soul"] = {
          name: preset.name,
          creature: preset.creature,
          vibe: preset.vibe,
          emoji: preset.emoji,
          avatar: preset.avatar,
          coreTruths: preset.coreTruths,
          boundaries: preset.boundaries,
          vibeStyle: preset.vibeStyle,
          continuity: true,
          // Tone attributes with defaults
          humor: preset.humor ?? 50,
          formality: preset.formality ?? 50,
          emojiUsage: preset.emojiUsage ?? 30,
          verbosity: preset.verbosity ?? 50,
          consciousness: preset.consciousness ?? 50,
          questioning: preset.questioning ?? 30,
        };
        set({ soul: newSoul });
        useHistoryStore.getState().push(newSoul);
      },

      undo: () => {
        const current = get().soul;
        const previous = useHistoryStore.getState().undo(current);
        if (previous) {
          set({ soul: previous });
          // Also push to history after undo
          setTimeout(() => {
            useHistoryStore.getState().push(previous);
          }, 100);
        }
      },

      redo: () => {
        const current = get().soul;
        const next = useHistoryStore.getState().redo(current);
        if (next) {
          set({ soul: next });
          setTimeout(() => {
            useHistoryStore.getState().push(next);
          }, 100);
        }
      },

      canUndo: () => useHistoryStore.getState().canUndo(),
      canRedo: () => useHistoryStore.getState().canRedo(),
    }),
    {
      name: "soul-storage",
      partialize: (state) => ({
        soul: state.soul,
        isDarkMode: state.isDarkMode,
        locale: state.locale,
      }),
    }
  )
);
