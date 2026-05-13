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
    // Big Five personality traits
    openness: number;        // 0-100, creativity/intellect
    conscientiousness: number; // 0-100, organization/dependability
    extraversion: number;    // 0-100, sociability/assertiveness
    agreeableness: number;   // 0-100, cooperation/trust
    neuroticism: number;     // 0-100, emotional instability
    // Advanced personality
    communicationMode: string;
    knowledgeDomains: string[];
    signaturePhrases: string[];
    emotionalRange: number; // 0=flat, 50=balanced, 100=dramatic
    // Speech Patterns
    speechPatterns: {
      alliteration: boolean;
      rhymeTendency: number; // 0-100
      metaphorFrequency: number; // 0-100
      technicalJargon: number; // 0-100
      slangUsage: number; // 0-100
    };
  };
  isDarkMode: boolean;
  locale: string;

  setSoul: (soul: Partial<SoulState["soul"]>) => void;
  setIsDarkMode: (isDark: boolean) => void;
  setLocale: (locale: string) => void;
  resetSoul: () => void;
  loadPreset: (preset: SoulPreset) => void;
  importSoul: (json: string) => { success: boolean; error?: string };
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
  customCoreTruths?: string[];
  customBoundaries?: string[];
  vibeStyle: string;
  description: string;
  tags: string[];
  source: "character" | "custom" | "original";
  humor?: number;
  formality?: number;
  emojiUsage?: number;
  verbosity?: number;
  consciousness?: number;
  questioning?: number;
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
  communicationMode?: string;
  knowledgeDomains?: string[];
  signaturePhrases?: string[];
  emotionalRange?: number;
  speechPatterns?: {
    alliteration?: boolean;
    rhymeTendency?: number;
    metaphorFrequency?: number;
    technicalJargon?: number;
    slangUsage?: number;
  };
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
        openness: 70,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 30,
        communicationMode: "direct",
        knowledgeDomains: [],
        signaturePhrases: [],
        emotionalRange: 50,
        speechPatterns: {
          alliteration: false,
          rhymeTendency: 10,
          metaphorFrequency: 30,
          technicalJargon: 40,
          slangUsage: 20,
        },
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
          openness: 70,
          conscientiousness: 50,
          extraversion: 50,
          agreeableness: 50,
          neuroticism: 30,
          communicationMode: "direct",
          knowledgeDomains: [],
          signaturePhrases: [],
          emotionalRange: 50,
          speechPatterns: {
            alliteration: false,
            rhymeTendency: 10,
            metaphorFrequency: 30,
            technicalJargon: 40,
            slangUsage: 20,
          },
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
          openness: preset.openness ?? 70,
          conscientiousness: preset.conscientiousness ?? 50,
          extraversion: preset.extraversion ?? 50,
          agreeableness: preset.agreeableness ?? 50,
          neuroticism: preset.neuroticism ?? 30,
          communicationMode: preset.communicationMode ?? "direct",
          knowledgeDomains: preset.knowledgeDomains ?? [],
          signaturePhrases: preset.signaturePhrases ?? [],
          emotionalRange: preset.emotionalRange ?? 50,
          speechPatterns: {
            alliteration: preset.speechPatterns?.alliteration ?? false,
            rhymeTendency: preset.speechPatterns?.rhymeTendency ?? 10,
            metaphorFrequency: preset.speechPatterns?.metaphorFrequency ?? 30,
            technicalJargon: preset.speechPatterns?.technicalJargon ?? 40,
            slangUsage: preset.speechPatterns?.slangUsage ?? 20,
          },
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
            openness: parsed.openness ?? 70,
            conscientiousness: parsed.conscientiousness ?? 50,
            extraversion: parsed.extraversion ?? 50,
            agreeableness: parsed.agreeableness ?? 50,
            neuroticism: parsed.neuroticism ?? 30,
            communicationMode: parsed.communicationMode ?? "direct",
            knowledgeDomains: Array.isArray(parsed.knowledgeDomains) ? parsed.knowledgeDomains : [],
            signaturePhrases: Array.isArray(parsed.signaturePhrases) ? parsed.signaturePhrases : [],
            emotionalRange: parsed.emotionalRange ?? 50,
            speechPatterns: {
              alliteration: parsed.speechPatterns?.alliteration ?? false,
              rhymeTendency: parsed.speechPatterns?.rhymeTendency ?? 10,
              metaphorFrequency: parsed.speechPatterns?.metaphorFrequency ?? 30,
              technicalJargon: parsed.speechPatterns?.technicalJargon ?? 40,
              slangUsage: parsed.speechPatterns?.slangUsage ?? 20,
            },
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
      name: "soul-storage",
      partialize: (state) => ({
        soul: state.soul,
        isDarkMode: state.isDarkMode,
        locale: state.locale,
      }),
    }
  )
);
