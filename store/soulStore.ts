import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  };
  isDarkMode: boolean;
  locale: string;
  
  setSoul: (soul: Partial<SoulState["soul"]>) => void;
  setIsDarkMode: (isDark: boolean) => void;
  setLocale: (locale: string) => void;
  resetSoul: () => void;
  loadPreset: (preset: SoulPreset) => void;
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
      },
      isDarkMode: false,
      locale: "en",
      
      setSoul: (soul) =>
        set((state) => ({
          soul: { ...state.soul, ...soul },
        })),
      
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
      
      setLocale: (locale) => set({ locale }),
      
      resetSoul: () =>
        set({
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
          },
        }),
      
      loadPreset: (preset) =>
        set({
          soul: {
            name: preset.name,
            creature: preset.creature,
            vibe: preset.vibe,
            emoji: preset.emoji,
            avatar: preset.avatar,
            coreTruths: preset.coreTruths,
            boundaries: preset.boundaries,
            vibeStyle: preset.vibeStyle,
            continuity: true,
          },
        }),
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
