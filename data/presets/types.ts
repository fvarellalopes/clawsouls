/**
 * Types for Soul Presets
 * Centralized type definitions for the preset system
 */

export interface SoulPresetCoreTruths {
  helpful: boolean;
  opinions: boolean;
  resourceful: boolean;
  trustworthy: boolean;
  respectful: boolean;
}

export interface SoulPresetBoundaries {
  private: boolean;
  askBeforeActing: boolean;
  noHalfBaked: boolean;
  notVoiceProxy: boolean;
}

export interface SoulPresetStats {
  humor: number;
  formality: number;
  emojiUsage: number;
  verbosity: number;
  consciousness: number;
  questioning: number;
  empathy?: number;
  creativity?: number;
  patience?: number;
}

export type VibeStyle = "concise" | "verbose" | "sharp" | "minimal" | "expressive" | "balanced" | "dramatic";

export type PresetCategory = 
  | "featured" 
  | "anime" 
  | "games" 
  | "movies" 
  | "comics" 
  | "tv" 
  | "books" 
  | "original";

export interface SoulPreset {
  id: string;
  name: string;
  creature: string;
  vibe: string;
  emoji: string;
  avatar?: string;
  coreTruths: SoulPresetCoreTruths;
  boundaries: SoulPresetBoundaries;
  customCoreTruths?: string[];
  customBoundaries?: string[];
  vibeStyle: VibeStyle;
  description: string;
  tags: string[];
  source: "character" | "custom";
  category?: PresetCategory;
  featured?: boolean;
  // Tone attributes
  humor: number;
  formality: number;
  emojiUsage: number;
  verbosity: number;
  consciousness: number;
  questioning: number;
  // Advanced attributes
  empathy?: number;
  creativity?: number;
  patience?: number;
}

export interface PresetChunk {
  id: PresetCategory;
  name: string;
  description: string;
  count: number;
  presets: SoulPreset[];
}

// Metadata for preset collections
export interface PresetMetadata {
  version: string;
  lastUpdated: string;
  totalPresets: number;
  categories: {
    id: PresetCategory;
    name: string;
    description: string;
    count: number;
  }[];
}
