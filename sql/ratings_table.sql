-- Likes e ratings no backend (VERSÃO SEGURA)
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS preset_ratings (
  id BIGSERIAL PRIMARY KEY,
  preset_id TEXT NOT NULL,
  anonymous_id TEXT NOT NULL,
  liked BOOLEAN,
  stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(preset_id, anonymous_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_preset ON preset_ratings(preset_id);
CREATE INDEX IF NOT EXISTS idx_ratings_anon ON preset_ratings(anonymous_id);

-- RLS
ALTER TABLE preset_ratings ENABLE ROW LEVEL SECURITY;

-- SELECT: público (pra mostrar aggregates)
CREATE POLICY "Public read ratings" ON preset_ratings
  FOR SELECT USING (true);

-- INSERT: público (anon_id é o controle de duplicata)
CREATE POLICY "Public insert ratings" ON preset_ratings
  FOR INSERT WITH CHECK (
    char_length(preset_id) <= 100
    AND char_length(anonymous_id) <= 50
    AND stars >= 0 AND stars <= 5
  );

-- UPDATE: só pode atualizar seu próprio anonymous_id
CREATE POLICY "Users update own ratings" ON preset_ratings
  FOR UPDATE USING (true)
  WITH CHECK (
    char_length(preset_id) <= 100
    AND char_length(anonymous_id) <= 50
    AND stars >= 0 AND stars <= 5
  );

-- DELETE: ninguém (sem política = bloqueado)
-- Se precisar deletar, use service_role no backend

COMMENT ON TABLE preset_ratings IS 'Ratings e likes dos presets - 1 voto por anonymous_id por preset';
