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
    customCoreTruths: string[];
    customBoundaries: string[];
    vibeStyle: string;
    continuity: boolean;
    // Tone attributes
    humor: number;
    formality: number;
    emojiUsage: number;
    verbosity: number;
    consciousness: number;
    questioning: number;
    // Advanced attributes (v2.0)
    empathy: number;
    creativity: number;
    patience: number;
  };
  isDarkMode: boolean;
  locale: string;
  // UI State
  activeTab: string;
  showAdvancedMode: boolean;
  chatHistory: ChatMessage[];

  setSoul: (soul: Partial<SoulState["soul"]>) => void;
  setIsDarkMode: (isDark: boolean) => void;
  setLocale: (locale: string) => void;
  setActiveTab: (tab: string) => void;
  setShowAdvancedMode: (show: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  resetSoul: () => void;
  loadPreset: (preset: SoulPreset) => void;
  importSoul: (json: string) => { success: boolean; error?: string };
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
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
  customCoreTruths?: string[];
  customBoundaries?: string[];
  vibeStyle: string;
  description: string;
  tags: string[];
  source: "character" | "custom";
  humor?: number;
  formality?: number;
  emojiUsage?: number;
  verbosity?: number;
  consciousness?: number;
  questioning?: number;
  // Advanced attributes (v2.0)
  empathy?: number;
  creativity?: number;
  patience?: number;
}

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
  customCoreTruths: [],
  customBoundaries: [],
  vibeStyle: "concise",
  continuity: true,
  humor: 50,
  formality: 50,
  emojiUsage: 30,
  verbosity: 50,
  consciousness: 50,
  questioning: 30,
  empathy: 50,
  creativity: 50,
  patience: 50,
};

export const useSoulStore = create<SoulState>()(
  persist(
    (set, get) => ({
      soul: { ...defaultSoul },
      isDarkMode: false,
      locale: "en",
      activeTab: "basic",
      showAdvancedMode: false,
      chatHistory: [],

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

      setActiveTab: (tab) => set({ activeTab: tab }),

      setShowAdvancedMode: (show) => set({ showAdvancedMode: show }),

      addChatMessage: (message) => {
        const { chatHistory } = get();
        set({ chatHistory: [...chatHistory, message].slice(-50) }); // Keep last 50 messages
      },

      clearChatHistory: () => set({ chatHistory: [] }),

      resetSoul: () => {
        set({ soul: { ...defaultSoul } });
        useHistoryStore.getState().push({ ...defaultSoul });
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
          customCoreTruths: preset.customCoreTruths ?? [],
          customBoundaries: preset.customBoundaries ?? [],
          vibeStyle: preset.vibeStyle,
          continuity: true,
          humor: preset.humor ?? 50,
          formality: preset.formality ?? 50,
          emojiUsage: preset.emojiUsage ?? 30,
          verbosity: preset.verbosity ?? 50,
          consciousness: preset.consciousness ?? 50,
          questioning: preset.questioning ?? 30,
          empathy: preset.empathy ?? 50,
          creativity: preset.creativity ?? 50,
          patience: preset.patience ?? 50,
        };
        set({ soul: newSoul });
        useHistoryStore.getState().push(newSoul);
      },

      importSoul: (json: string) => {
        try {
          const parsed = JSON.parse(json);
          // Validate required fields
          if (!parsed.name && !parsed.creature) {
            return { success: false, error: "JSON must have at least 'name' or 'creature' field" };
          }
          const newSoul: SoulState["soul"] = {
            name: parsed.name ?? "",
            creature: parsed.creature ?? "",
            vibe: parsed.vibe ?? "",
            emoji: parsed.emoji ?? "",
            avatar: parsed.avatar,
            coreTruths: {
              helpful: parsed.coreTruths?.helpful ?? true,
              opinions: parsed.coreTruths?.opinions ?? true,
              resourceful: parsed.coreTruths?.resourceful ?? true,
              trustworthy: parsed.coreTruths?.trustworthy ?? true,
              respectful: parsed.coreTruths?.respectful ?? true,
            },
            boundaries: {
              private: parsed.boundaries?.private ?? true,
              askBeforeActing: parsed.boundaries?.askBeforeActing ?? true,
              noHalfBaked: parsed.boundaries?.noHalfBaked ?? true,
              notVoiceProxy: parsed.boundaries?.notVoiceProxy ?? true,
            },
            customCoreTruths: Array.isArray(parsed.customCoreTruths) ? parsed.customCoreTruths : [],
            customBoundaries: Array.isArray(parsed.customBoundaries) ? parsed.customBoundaries : [],
            vibeStyle: parsed.vibeStyle ?? "concise",
            continuity: parsed.continuity ?? true,
            humor: parsed.humor ?? 50,
            formality: parsed.formality ?? 50,
            emojiUsage: parsed.emojiUsage ?? 30,
            verbosity: parsed.verbosity ?? 50,
            consciousness: parsed.consciousness ?? 50,
            questioning: parsed.questioning ?? 30,
            empathy: parsed.empathy ?? 50,
            creativity: parsed.creativity ?? 50,
            patience: parsed.patience ?? 50,
          };
          set({ soul: newSoul });
          useHistoryStore.getState().push(newSoul);
          return { success: true };
        } catch (e) {
          return { success: false, error: "Invalid JSON format" };
        }
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
      name: "soul-storage-v2",
      version: 2,
      partialize: (state) => ({
        soul: state.soul,
        isDarkMode: state.isDarkMode,
        locale: state.locale,
        showAdvancedMode: state.showAdvancedMode,
      }),
      migrate: (persistedState: any, version) => {
        if (version === 1) {
          // Migration from v1 to v2: add advanced attributes
          return {
            ...persistedState,
            soul: {
              ...persistedState.soul,
              empathy: persistedState.soul.empathy ?? 50,
              creativity: persistedState.soul.creativity ?? 50,
              patience: persistedState.soul.patience ?? 50,
            },
          };
        }
        return persistedState;
      },
    }
  )
);
