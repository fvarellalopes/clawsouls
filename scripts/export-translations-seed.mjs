#!/usr/bin/env node
/**
 * Export preset_translations from Supabase to SQL seed file
 * Usage: node scripts/export-translations-seed.mjs
 */

import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function fetchAllTranslations() {
  const all = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/preset_translations?select=preset_id,locale,name,description,creature,vibe,tags&limit=${pageSize}&offset=${offset}&order=preset_id,locale`;
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
    process.stderr.write(`  Fetched ${all.length}...\n`);
  }

  return all;
}

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

async function main() {
  console.error('Exporting preset_translations from Supabase...');
  const rows = await fetchAllTranslations();
  console.error(`  Total: ${rows.length} translations`);

  const output = 'data/migrations/003_seed_translations.sql';
  const lines = [
    '-- Seed: preset_translations',
    `-- Auto-generated on ${new Date().toISOString()}`,
    '-- Run after 003_preset_translations.sql to restore translated data',
    '',
    'INSERT INTO preset_translations (preset_id, locale, name, description, creature, vibe, tags) VALUES',
  ];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const name = escapeSql(r.name);
    const desc = escapeSql(r.description);
    const creature = escapeSql(r.creature);
    const vibe = escapeSql(r.vibe);
    const tags = escapeSql(typeof r.tags === 'string' ? r.tags : JSON.stringify(r.tags || []));
    const comma = i < rows.length - 1 ? ',' : '';
    lines.push(`  ('${r.preset_id.toLowerCase()}', '${r.locale}', '${name}', '${desc}', '${creature}', '${vibe}', '${tags}'::json)${comma}`);
  }

  lines.push('ON CONFLICT (preset_id, locale) DO UPDATE SET');
  lines.push('  name = EXCLUDED.name,');
  lines.push('  description = EXCLUDED.description,');
  lines.push('  creature = EXCLUDED.creature,');
  lines.push('  vibe = EXCLUDED.vibe,');
  lines.push('  tags = EXCLUDED.tags,');
  lines.push('  updated_at = NOW();');
  lines.push('');
  lines.push(`-- Total: ${rows.length} translations`);

  fs.writeFileSync(output, lines.join('\n') + '\n');
  console.error(`✅ Exported ${rows.length} translations to ${output}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
