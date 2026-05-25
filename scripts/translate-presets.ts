/**
 * Translate presets to all supported locales via Supabase.
 * Uses curl for OpenGateway API calls (avoids Node.js fetch gzip issues).
 * 
 * Usage: npx tsx scripts/translate-presets.ts [--locale pt] [--batch 10] [--dry-run]
 * 
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GITLAWB_API_KEY in .env.local
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Load env from .env.local ONLY
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

// Also load GITLAWB_API_KEY from global .env if not in .env.local
if (!process.env.GITLAWB_API_KEY) {
  const globalEnv = path.join(process.env.HOME || '/home/ubuntu', '.hermes', '.env');
  if (fs.existsSync(globalEnv)) {
    for (const line of fs.readFileSync(globalEnv, 'utf-8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim();
      if (k === 'GITLAWB_API_KEY' && !process.env[k]) process.env[k] = v;
    }
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const API_KEY = process.env.GITLAWB_API_KEY || '';
const API_BASE = 'https://opengateway.gitlawb.com/v1';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!API_KEY) {
  console.error('Missing GITLAWB_API_KEY');
  process.exit(1);
}

// Supported locales (excluding 'en' which is the source)
const LOCALES = ['pt', 'es', 'fr', 'de', 'ja', 'zh'];

// Parse CLI args
const args = process.argv.slice(2);
const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1];
const batchArg = args.find(a => a.startsWith('--batch='))?.split('=')[1];
const dryRun = args.includes('--dry-run');
const targetLocales = localeArg ? [localeArg] : LOCALES;
const batchSize = batchArg ? parseInt(batchArg) : 10;

// ─── Helpers ────────────────────────────────────────────────────────
function curlGet(url: string): any {
  const result = execSync(
    `curl -s -m 30 "${url}" -H "apikey: ${SUPABASE_KEY}" -H "Authorization: Bearer ${SUPABASE_KEY}"`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );
  return JSON.parse(result);
}

function curlPost(url: string, body: string, headers: Record<string, string> = {}): string {
  const allHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...headers,
  };
  const headerArgs = Object.entries(allHeaders)
    .map(([k, v]) => `-H "${k}: ${v}"`)
    .join(' ');
  const escapedBody = body.replace(/'/g, "'\\''");
  return execSync(
    `curl -s -m 60 ${headerArgs} -d '${escapedBody}' "${url}"`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );
}

function translateViaLLM(prompt: string): string {
  const body = JSON.stringify({
    model: 'mimo-v2.5',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
    temperature: 0.2,
  });
  const result = execSync(
    `curl -s -m 60 -H "Content-Type: application/json" -H "Authorization: Bearer ${API_KEY}" -d '${body.replace(/'/g, "'\\''")}' "${API_BASE}/chat/completions"`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );
  const data = JSON.parse(result);
  return data.choices?.[0]?.message?.content || '';
}

// ─── Step 1: Fetch presets ──────────────────────────────────────────
function fetchPresets(): any[] {
  console.log('Step 1: Fetching presets from Supabase...');
  const allPresets: any[] = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/presets?select=id,name,description,creature,vibe,tags&limit=${pageSize}&offset=${offset}&order=id`;
    const batch = curlGet(url);
    allPresets.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  console.log(`  ✓ Fetched ${allPresets.length} presets`);
  return allPresets;
}

// ─── Step 2: Check existing translations ────────────────────────────
function getExistingTranslations(locale: string): Set<string> {
  const url = `${SUPABASE_URL}/rest/v1/preset_translations?select=preset_id&locale=eq.${locale}`;
  const rows = curlGet(url);
  return new Set(rows.map((r: any) => r.preset_id));
}

// ─── Step 3: Translate via LLM ──────────────────────────────────────
function translateBatch(presets: any[], locale: string): any[] {
  const localeNames: Record<string, string> = {
    pt: 'Portuguese (Brazil)',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    zh: 'Chinese (Simplified)',
  };

  const localeName = localeNames[locale] || locale;

  const prompt = `You are a professional translator for a cyberpunk-themed AI character platform.

Translate the following preset data from English to ${localeName}.

RULES:
- Keep the cyberpunk/dark aesthetic tone
- Names of well-known characters should stay in their original form or use the commonly known localized version
- Creature types should be translated naturally
- Tags should be translated to common equivalents
- Vibe descriptions should maintain the atmospheric quality
- DO NOT translate: proper nouns already well-known, character IDs

INPUT (JSON array):
${JSON.stringify(presets.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    creature: p.creature,
    vibe: p.vibe,
    tags: p.tags,
  })), null, 2)}

OUTPUT: Respond with ONLY a valid JSON array. No markdown, no explanation.`;

  const content = translateViaLLM(prompt);

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse translation response: ${content.slice(0, 300)}`);
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(jsonStr);
}

// ─── Step 4: Upsert translations ────────────────────────────────────
function upsertTranslations(translations: any[], locale: string) {
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

  const result = curlPost(
    `${SUPABASE_URL}/rest/v1/preset_translations`,
    JSON.stringify(rows),
    { 'Prefer': 'resolution=merge-duplicates' }
  );

  // Check for errors
  if (result.includes('"code"') && result.includes('"message"')) {
    console.error(`  ✗ Supabase error: ${result.slice(0, 200)}`);
  } else {
    console.log(`  ✓ Upserted ${rows.length} translations for ${locale}`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────
function main() {
  console.log('=== ClawSouls Preset Translator (curl-based) ===');
  console.log(`Locales: ${targetLocales.join(', ')}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Step 1: Fetch presets
  const presets = fetchPresets();
  if (presets.length === 0) {
    console.error('No presets found. Exiting.');
    process.exit(1);
  }

  // Step 2-4: Translate for each locale
  for (const locale of targetLocales) {
    console.log(`\n--- Translating to ${locale} ---`);

    // Check existing translations
    const existing = getExistingTranslations(locale);
    console.log(`  Existing translations: ${existing.size}`);

    // Filter presets that need translation
    const toTranslate = presets.filter(p => !existing.has(p.id));
    console.log(`  Presets to translate: ${toTranslate.length}`);

    if (toTranslate.length === 0) {
      console.log(`  ✓ All presets already translated to ${locale}`);
      continue;
    }

    // Process in batches
    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 5;

    for (let i = 0; i < toTranslate.length; i += batchSize) {
      const batch = toTranslate.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(toTranslate.length / batchSize);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length} presets)... `);

      try {
        const translations = translateBatch(batch, locale);
        upsertTranslations(translations, locale);
        consecutiveFailures = 0;
        console.log('✓');
      } catch (err: any) {
        consecutiveFailures++;
        console.log(`✗ ${err.message?.slice(0, 80)}`);

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          console.error(`  ✗✗ Too many consecutive failures (${consecutiveFailures}). Stopping.`);
          break;
        }
      }

      // Rate limiting
      if (i + batchSize < toTranslate.length) {
        execSync('sleep 1');
      }
    }
  }

  console.log('\n=== Translation complete ===');
}

main();
