-- RLS policy for shared_souls table
-- Execute no Supabase SQL Editor

-- Enable RLS if not already enabled
ALTER TABLE shared_souls ENABLE ROW LEVEL SECURITY;

-- SELECT: público (pra ler shared links)
CREATE POLICY "Public read shared_souls" ON shared_souls
  FOR SELECT USING (true);

-- INSERT: público (criar share links), com limites de tamanho
CREATE POLICY "Public insert shared_souls" ON shared_souls
  FOR INSERT WITH CHECK (
    char_length(id) <= 20
    AND char_length(soul_data::text) <= 100000
  );

-- UPDATE: ninguém (shares são imutáveis)
-- DELETE: ninguém (use service_role no backend se precisar)

COMMENT ON TABLE shared_souls IS 'Shared soul links - public read, public insert with size limits';
