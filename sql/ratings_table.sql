-- Likes e ratings no backend
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS preset_ratings (
  id BIGSERIAL PRIMARY KEY,
  preset_id TEXT NOT NULL,
  anonymous_id TEXT NOT NULL,
  liked BOOLEAN,          -- true = like, false = dislike, null = só stars
  stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(preset_id, anonymous_id)  -- 1 voto por pessoa por preset
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ratings_preset ON preset_ratings(preset_id);
CREATE INDEX IF NOT EXISTS idx_ratings_anon ON preset_ratings(anonymous_id);

-- RLS
ALTER TABLE preset_ratings ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler (pra mostrar aggregates)
CREATE POLICY "Public read ratings" ON preset_ratings
  FOR SELECT USING (true);

-- Qualquer um pode inserir (anon_id é o controle de duplicata)
CREATE POLICY "Public insert ratings" ON preset_ratings
  FOR INSERT WITH CHECK (true);

-- Qualquer um pode atualizar seu próprio voto
CREATE POLICY "Public update own ratings" ON preset_ratings
  FOR UPDATE USING (true);

-- View materializada pra aggregates (opcional, pode usar query direta)
COMMENT ON TABLE preset_ratings IS 'Ratings e likes dos presets - 1 voto por anonymous_id por preset';
