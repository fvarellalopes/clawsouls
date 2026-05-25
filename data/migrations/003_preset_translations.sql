-- Migration 003: Preset translations table
-- Stores translated text for preset fields per locale

CREATE TABLE IF NOT EXISTS preset_translations (
  preset_id TEXT NOT NULL,
  locale TEXT NOT NULL,         -- 'en', 'pt', 'es', 'fr', 'de', 'ja', 'zh'
  name TEXT,
  description TEXT,
  creature TEXT,
  vibe TEXT,
  tags JSON DEFAULT '[]',       -- translated tag labels
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (preset_id, locale),
  FOREIGN KEY (preset_id) REFERENCES presets(id) ON DELETE CASCADE
);

-- Index for fast lookups by locale
CREATE INDEX idx_preset_translations_locale ON preset_translations(locale);

-- Index for fast lookups by preset_id
CREATE INDEX idx_preset_translations_preset ON preset_translations(preset_id);
