-- Migration 001: Initial schema for presets
CREATE TABLE IF NOT EXISTS presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  creature TEXT DEFAULT 'Human',
  vibe TEXT,
  emoji TEXT DEFAULT '😊',
  avatar TEXT,
  core_truths_helpful BOOLEAN DEFAULT 1,
  core_truths_opinions BOOLEAN DEFAULT 1,
  core_truths_resourceful BOOLEAN DEFAULT 1,
  core_truths_trustworthy BOOLEAN DEFAULT 1,
  core_truths_respectful BOOLEAN DEFAULT 1,
  boundaries_private BOOLEAN DEFAULT 1,
  boundaries_ask_before_acting BOOLEAN DEFAULT 0,
  boundaries_no_half_baked BOOLEAN DEFAULT 0,
  boundaries_not_voice_proxy BOOLEAN DEFAULT 1,
  vibe_style TEXT DEFAULT 'balanced',
  humor INTEGER DEFAULT 50,
  formality INTEGER DEFAULT 50,
  emoji_usage INTEGER DEFAULT 10,
  verbosity INTEGER DEFAULT 50,
  consciousness INTEGER DEFAULT 50,
  questioning INTEGER DEFAULT 30,
  description TEXT,
  tags JSON DEFAULT '[]',
  source TEXT DEFAULT 'character',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_presets_creature ON presets(creature);
CREATE INDEX idx_presets_source ON presets(source);
CREATE INDEX idx_presets_tags ON presets(tags); -- JSON index (SQLite 3.38+)

-- Migration history table
CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
