/**
 * @deprecated Use @/data/presets/index instead
 * This file is kept for backward compatibility
 */

export {
  // Main exports
  allPresets,
  allPresets as presets,
  featuredPresets,
  animePresets,
  gamesPresets,
  moviesPresets,
  comicsPresets,
  
  // Utilities
  getPresetsByCategory,
  getPresetById,
  searchPresets,
  searchPresets as searchAllPresets,
  getFeaturedPresets,
  getAllTags,
  validatePreset,
  findDuplicateIds,
  
  // Metadata
  presetMetadata,
  PRESETS_VERSION,
  
  // Attribute options
  attributeOptions,
  
  // Types
  type SoulPreset,
  type PresetCategory,
  type PresetMetadata,
  type VibeStyle,
} from "./presets/index";
