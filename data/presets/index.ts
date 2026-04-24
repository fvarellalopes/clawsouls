/**
 * Presets Index - Centralized Preset Loading System
 * 
 * Features:
 * - Chunked loading by category for better performance
 * - Featured presets pre-loaded
 * - Lazy loading for other categories
 * - Type-safe preset access
 */

import { SoulPreset, PresetCategory, PresetMetadata } from "./types";
import { featuredPresets } from "./featured";
import { animePresets } from "./anime";
import { gamesPresets } from "./games";
import { moviesPresets } from "./movies";
import { comicsPresets } from "./comics";

// Attribute options for soul editor sliders
export const attributeOptions = {
  humor: [
    { value: 0, label: "Sério/Absoluto" },
    { value: 25, label: "Reservado" },
    { value: 50, label: "Equilibrado" },
    { value: 75, label: "Irônico" },
    { value: 100, label: "Piadista/Descontraído" },
  ],
  formality: [
    { value: 0, label: "Coloquial/Informal" },
    { value: 25, label: "Casual" },
    { value: 50, label: "Neutro" },
    { value: 75, label: "Profissional" },
    { value: 100, label: "Acadêmico/Formal" },
  ],
  emojiUsage: [
    { value: 0, label: "Nunca" },
    { value: 25, label: "Raramente" },
    { value: 50, label: "Moderado" },
    { value: 75, label: "Frequentemente" },
    { value: 100, label: "Emoji Overlord" },
  ],
  verbosity: [
    { value: 0, label: "Ultra-conciso (título e bônus)" },
    { value: 25, label: "Resumido" },
    { value: 50, label: "Equilibrado" },
    { value: 75, label: "Detalhado" },
    { value: 100, label: "Ensaiístico/Verboso" },
  ],
  consciousness: [
    { value: 0, label: "Autômato" },
    { value: 25, label: "Procedural" },
    { value: 50, label: "Consciente" },
    { value: 75, label: "Reflexivo" },
    { value: 100, label: "Auto-consciente" },
  ],
  questioning: [
    { value: 0, label: "Nunca pergunta" },
    { value: 25, label: "Raramente" },
    { value: 50, label: "Equilibrado" },
    { value: 75, label: "Investigativo" },
    { value: 100, label: "Socrático (sempre pergunta)" },
  ],
  empathy: [
    { value: 0, label: "Neutro/Lógico" },
    { value: 25, label: "Simpático" },
    { value: 50, label: "Empático" },
    { value: 75, label: "Compassivo" },
    { value: 100, label: "Absorvente Emocional" },
  ],
  creativity: [
    { value: 0, label: "Literal" },
    { value: 25, label: "Tradicional" },
    { value: 50, label: "Criativo" },
    { value: 75, label: "Inovador" },
    { value: 100, label: "Visionário" },
  ],
  patience: [
    { value: 0, label: "Imediato" },
    { value: 25, label: "Rápido" },
    { value: 50, label: "Moderado" },
    { value: 75, label: "Paciente" },
    { value: 100, label: "Ilimitado" },
  ],
};

// Current version for schema validation
export const PRESETS_VERSION = "2.0.0";

// Metadata about the preset collection
export const presetMetadata: PresetMetadata = {
  version: PRESETS_VERSION,
  lastUpdated: "2025-01-20",
  totalPresets: 
    featuredPresets.length + 
    animePresets.length + 
    gamesPresets.length + 
    moviesPresets.length + 
    comicsPresets.length,
  categories: [
    {
      id: "featured",
      name: "Featured",
      description: "Curated high-quality presets",
      count: featuredPresets.length,
    },
    {
      id: "anime",
      name: "Anime",
      description: "Iconic anime characters",
      count: animePresets.length,
    },
    {
      id: "games",
      name: "Video Games",
      description: "Legendary video game characters",
      count: gamesPresets.length,
    },
    {
      id: "movies",
      name: "Movies & TV",
      description: "Film and television icons",
      count: moviesPresets.length,
    },
    {
      id: "comics",
      name: "Comics",
      description: "Comic book heroes and villains",
      count: comicsPresets.length,
    },
  ],
};

// All presets combined (for compatibility)
export const allPresets: SoulPreset[] = [
  ...featuredPresets,
  ...animePresets,
  ...gamesPresets,
  ...moviesPresets,
  ...comicsPresets,
];

// Featured presets only (for homepage)
export const presets = featuredPresets;

// Export individual categories
export {
  featuredPresets,
  animePresets,
  gamesPresets,
  moviesPresets,
  comicsPresets,
};

// Category-based preset access
const categoryMap: Record<PresetCategory, SoulPreset[]> = {
  featured: featuredPresets,
  anime: animePresets,
  games: gamesPresets,
  movies: moviesPresets,
  comics: comicsPresets,
  tv: moviesPresets, // TV shows included in movies for now
  books: featuredPresets, // Literature in featured for now
  original: featuredPresets.filter(p => p.category === "original"),
};

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: PresetCategory): SoulPreset[] {
  return categoryMap[category] || [];
}

/**
 * Get a preset by ID from all categories
 */
export function getPresetById(id: string): SoulPreset | undefined {
  // Search all categories
  for (const category of Object.values(categoryMap)) {
    const preset = category.find(p => p.id === id);
    if (preset) return preset;
  }
  return undefined;
}

/**
 * Search presets by name or tags
 */
export function searchPresets(query: string): SoulPreset[] {
  const lowerQuery = query.toLowerCase();
  return allPresets.filter(preset =>
    preset.name.toLowerCase().includes(lowerQuery) ||
    preset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get featured presets for homepage display
 */
export function getFeaturedPresets(limit?: number): SoulPreset[] {
  const featured = allPresets.filter(p => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Get presets by tag
 */
export function getPresetsByTag(tag: string): SoulPreset[] {
  const lowerTag = tag.toLowerCase();
  return allPresets.filter(p => 
    p.tags.some(t => t.toLowerCase() === lowerTag)
  );
}

/**
 * Get all unique tags across presets
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  allPresets.forEach(p => p.tags.forEach(t => tagSet.add(t.toLowerCase())));
  return Array.from(tagSet).sort();
}

/**
 * Validate a preset against the schema
 */
export function validatePreset(preset: Partial<SoulPreset>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!preset.id) errors.push("Missing id");
  if (!preset.name) errors.push("Missing name");
  if (!preset.creature) errors.push("Missing creature");
  if (!preset.vibe) errors.push("Missing vibe");
  if (!preset.emoji) errors.push("Missing emoji");
  if (!preset.vibeStyle) errors.push("Missing vibeStyle");
  if (!preset.description) errors.push("Missing description");
  if (!preset.tags || preset.tags.length === 0) errors.push("Missing tags");
  
  if (preset.coreTruths) {
    const required = ["helpful", "opinions", "resourceful", "trustworthy", "respectful"];
    required.forEach(key => {
      if (typeof (preset.coreTruths as any)[key] !== "boolean") {
        errors.push(`Missing coreTruth: ${key}`);
      }
    });
  } else {
    errors.push("Missing coreTruths");
  }
  
  if (preset.boundaries) {
    const required = ["private", "askBeforeActing", "noHalfBaked", "notVoiceProxy"];
    required.forEach(key => {
      if (typeof (preset.boundaries as any)[key] !== "boolean") {
        errors.push(`Missing boundary: ${key}`);
      }
    });
  } else {
    errors.push("Missing boundaries");
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Check for duplicate IDs across all presets
 */
export function findDuplicateIds(): { id: string; count: number; presets: SoulPreset[] }[] {
  const idMap = new Map<string, SoulPreset[]>();
  
  allPresets.forEach(preset => {
    const existing = idMap.get(preset.id) || [];
    existing.push(preset);
    idMap.set(preset.id, existing);
  });
  
  return Array.from(idMap.entries())
    .filter(([_, presets]) => presets.length > 1)
    .map(([id, presets]) => ({ id, count: presets.length, presets }));
}

export * from "./types";
