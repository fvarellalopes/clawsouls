/**
 * Create preset_translations table in Supabase.
 * Run: npx tsx scripts/create-translations-table.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

const URL = process.env.SUPABASE_URL || '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function createTable() {
  console.log('Creating preset_translations table...');

  // Use the Supabase REST API with rpc
  const res = await fetch(`${URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        CREATE TABLE IF NOT EXISTS preset_translations (
          preset_id TEXT NOT NULL,
          locale TEXT NOT NULL,
          name TEXT,
          description TEXT,
          creature TEXT,
          vibe TEXT,
          tags JSONB DEFAULT '[]',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          PRIMARY KEY (preset_id, locale)
        );
        
        CREATE INDEX IF NOT EXISTS idx_preset_translations_locale 
          ON preset_translations(locale);
        
        CREATE INDEX IF NOT EXISTS idx_preset_translations_preset 
          ON preset_translations(preset_id);
      `
    }),
  });

  const text = await res.text();
  console.log('Response:', res.status, text);

  if (!res.ok) {
    console.log('\nIf the exec_sql function does not exist, please run this SQL in the Supabase SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS preset_translations (
  preset_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT,
  description TEXT,
  creature TEXT,
  vibe TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (preset_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_preset_translations_locale 
  ON preset_translations(locale);

CREATE INDEX IF NOT EXISTS idx_preset_translations_preset 
  ON preset_translations(preset_id);
    `);
  } else {
    console.log('✓ Table created successfully');
  }
}

createTable().catch(console.error);
