/**
 * Translate presets to all supported locales via Supabase.
 * 
 * 1. Creates preset_translations table if not exists
 * 2. Fetches all presets from Supabase
 * 3. Translates name, description, creature, vibe to each locale
 * 4. Upserts translations into preset_translations
 * 
 * Usage: npx tsx scripts/translate-presets.ts [--locale pt] [--batch 50] [--dry-run]
 * 
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local and global ~/.hermes/.env
const envPaths = [
  path.join(__dirname, '..', '.env.local'),
  path.join(process.env.HOME || '~', '.hermes', '.env'),
];
for (const envPath of envPaths) {
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
}

const URL = process.env.SUPABASE_URL || '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!URL || !KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const HEADERS = {
  'apikey': KEY,
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

// Supported locales (excluding 'en' which is the source)
const LOCALES = ['pt', 'es', 'fr', 'de', 'ja', 'zh'];

// Parse CLI args
const args = process.argv.slice(2);
const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1];
const batchArg = args.find(a => a.startsWith('--batch='))?.split('=')[1];
const dryRun = args.includes('--dry-run');
const targetLocales = localeArg ? [localeArg] : LOCALES;
const batchSize = batchArg ? parseInt(batchArg) : 20;

// ─── Step 1: Create table ───────────────────────────────────────────
async function createTable() {
  console.log('Step 1: Creating preset_translations table if not exists...');

  const sql = `
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

CREATE INDEX IF NOT EXISTS idx_preset_translations_locale ON preset_translations(locale);
CREATE INDEX IF NOT EXISTS idx_preset_translations_preset ON preset_translations(preset_id);
`;

  const res = await fetch(`${URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    // Try direct SQL endpoint
    const res2 = await fetch(`${URL}/rest/v1/sql`, {
      method: 'POST',
      headers: HEADERS,
      body: sql,
    });
    if (!res2.ok) {
      const text = await res2.text();
      console.error('Failed to create table:', text);
      console.log('You may need to create the table manually in Supabase SQL editor:');
      console.log(sql);
      return false;
    }
  }

  console.log('  ✓ Table created/verified');
  return true;
}

// ─── Step 2: Fetch presets ──────────────────────────────────────────
async function fetchPresets(): Promise<any[]> {
  console.log('Step 2: Fetching presets from Supabase...');

  const allPresets: any[] = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const res = await fetch(
      `${URL}/rest/v1/presets?select=id,name,description,creature,vibe,tags&limit=${pageSize}&offset=${offset}&order=id`,
      { headers: HEADERS }
    );

    if (!res.ok) {
      console.error('Failed to fetch presets:', await res.text());
      break;
    }

    const batch = await res.json();
    allPresets.push(...batch);

    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  console.log(`  ✓ Fetched ${allPresets.length} presets`);
  return allPresets;
}

// ─── Step 3: Check existing translations ────────────────────────────
async function getExistingTranslations(locale: string): Promise<Set<string>> {
  const res = await fetch(
    `${URL}/rest/v1/preset_translations?select=preset_id&locale=eq.${locale}`,
    { headers: { ...HEADERS, 'Accept': 'application/json' } }
  );

  if (!res.ok) return new Set();

  const rows = await res.json();
  return new Set(rows.map((r: any) => r.preset_id));
}

// ─── Step 4: Translate via LLM ──────────────────────────────────────
async function translateBatch(
  presets: any[],
  locale: string
): Promise<any[]> {
  const localeNames: Record<string, string> = {
    pt: 'Portuguese (Brazil)',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    zh: 'Chinese (Simplified)',
  };

  const localeName = localeNames[locale] || locale;

  const prompt = `You are a professional translator for a cyberpunk-themed AI character platform called ClawSouls.

Translate the following preset data from English to ${localeName}.

RULES:
- Keep the cyberpunk/dark aesthetic tone
- Names of well-known characters (e.g., "Sherlock Holmes", "Einstein") should stay in their original form or use the commonly known localized version
- Creature types should be translated naturally (e.g., "Digital Phoenix" → "Fênix Digital" in PT)
- Tags should be translated to common equivalents
- Vibe descriptions should maintain the atmospheric quality
- DO NOT translate: proper nouns that are already well-known, technical terms, character IDs

INPUT (JSON array of presets):
${JSON.stringify(presets.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description,
  creature: p.creature,
  vibe: p.vibe,
  tags: p.tags,
})), null, 2)}

OUTPUT (JSON array with same structure, translated):
Respond with ONLY the JSON array, no explanation.`;

  // Use the OpenGateway API for translation
  const apiKey = process.env.GITLAWB_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.GITLAWB_BASE_URL || 'https://opengateway.gitlawb.com/v1';
  const model = process.env.TRANSLATION_MODEL || 'mimo-v2.5-pro';

  if (!apiKey) {
    throw new Error('No API key found for translation. Set OPENROUTER_API_KEY or OPENAI_API_KEY');
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 8000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Translation API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Extract JSON from response (might be wrapped in markdown code blocks)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse translation response: ${content.slice(0, 200)}`);
  }

  return JSON.parse(jsonMatch[0]);
}

// ─── Step 5: Upsert translations ────────────────────────────────────
async function upsertTranslations(translations: any[], locale: string) {
  if (dryRun) {
    console.log(`  [DRY RUN] Would upsert ${translations.length} translations for ${locale}`);
    return;
  }

  const rows = translations.map(t => ({
    preset_id: t.id,
    locale,
    name: t.name,
    description: t.description,
    creature: t.creature,
    vibe: t.vibe,
    tags: JSON.stringify(t.tags || []),
    updated_at: new Date().toISOString(),
  }));

  const res = await fetch(`${URL}/rest/v1/preset_translations`, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upsert translations: ${text}`);
  }

  console.log(`  ✓ Upserted ${rows.length} translations for ${locale}`);
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log('=== ClawSouls Preset Translator ===');
  console.log(`Locales: ${targetLocales.join(', ')}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Step 1: Create table (skip if already exists)
  console.log('Step 1: Verifying preset_translations table...');
  console.log('  ✓ Table should already exist (created manually)');

  // Step 2: Fetch presets
  const presets = await fetchPresets();
  if (presets.length === 0) {
    console.error('No presets found. Exiting.');
    process.exit(1);
  }

  // Step 3-5: Translate for each locale
  for (const locale of targetLocales) {
    console.log(`\n--- Translating to ${locale} ---`);

    // Check existing translations
    const existing = await getExistingTranslations(locale);
    console.log(`  Existing translations: ${existing.size}`);

    // Filter presets that need translation
    const toTranslate = presets.filter(p => !existing.has(p.id));
    console.log(`  Presets to translate: ${toTranslate.length}`);

    if (toTranslate.length === 0) {
      console.log(`  ✓ All presets already translated to ${locale}`);
      continue;
    }

    // Process in batches
    for (let i = 0; i < toTranslate.length; i += batchSize) {
      const batch = toTranslate.slice(i, i + batchSize);
      console.log(`  Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(toTranslate.length / batchSize)} (${batch.length} presets)...`);

      try {
        const translations = await translateBatch(batch, locale);
        await upsertTranslations(translations, locale);
      } catch (err: any) {
        console.error(`  ✗ Error translating batch: ${err.message}`);
        // Continue with next batch
      }

      // Rate limiting: wait 1 second between batches
      if (i + batchSize < toTranslate.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  console.log('\n=== Translation complete ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
