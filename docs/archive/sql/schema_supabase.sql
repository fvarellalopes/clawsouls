-- Schema completo para tabela de presets no Supabase
-- Execute este arquivo no Supabase SQL Editor ou via psql

CREATE TABLE IF NOT EXISTS presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  creature TEXT DEFAULT 'Human',
  vibe TEXT,
  emoji TEXT DEFAULT '😊',
  avatar TEXT,
  core_truths_helpful BOOLEAN DEFAULT true,
  core_truths_opinions BOOLEAN DEFAULT true,
  core_truths_resourceful BOOLEAN DEFAULT true,
  core_truths_trustworthy BOOLEAN DEFAULT true,
  core_truths_respectful BOOLEAN DEFAULT true,
  boundaries_private BOOLEAN DEFAULT true,
  boundaries_ask_before_acting BOOLEAN DEFAULT false,
  boundaries_no_half_baked BOOLEAN DEFAULT false,
  boundaries_not_voice_proxy BOOLEAN DEFAULT true,
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

-- Índices para performance (apenas campos escalares, não JSON)
CREATE INDEX IF NOT EXISTS idx_presets_source ON presets(source);
CREATE INDEX IF NOT EXISTS idx_presets_creature ON presets(creature);
CREATE INDEX IF NOT EXISTS idx_presets_name ON presets(name);

-- Para buscar tags dentro do JSON, use GIN (apenas se necessário)
-- CREATE INDEX IF NOT EXISTS idx_presets_tags ON presets USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (anon key pode ler tudo)
CREATE POLICY "Public read access" ON presets
  FOR SELECT USING (true);

-- Política de escrita apenas para service role (backend)
CREATE POLICY "Service role write access" ON presets
  FOR ALL USING (auth.role() = 'service_role');

-- Comentários
COMMENT ON TABLE presets IS 'Presets de personalidade para o ClawSouls';
COMMENT ON COLUMN presets.id IS 'ID único (slug kebab-case)';
COMMENT ON COLUMN presets.tags IS 'Array de tags para categorização';
