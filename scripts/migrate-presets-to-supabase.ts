/**
 * Migrate enriched presets to Supabase via REST API (no supabase-js dependency).
 * 1. Create table if not exists
 * 2. Upsert all 509 presets
 *
 * Usage: npx tsx scripts/migrate-presets-to-supabase.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local
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

// ─── Step 1: Create table ───────────────────────────────────────────
async function createTable() {
  console.log('Step 1: Creating presets table if not exists...');

  const sql = `
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
  openness INTEGER DEFAULT 70,
  conscientiousness INTEGER DEFAULT 50,
  extraversion INTEGER DEFAULT 50,
  agreeableness INTEGER DEFAULT 50,
  neuroticism INTEGER DEFAULT 30,
  description TEXT,
  tags JSONB DEFAULT '[]',
  source TEXT DEFAULT 'character',
  communication_mode TEXT,
  knowledge_domains JSONB,
  signature_phrases JSONB,
  emotional_range INTEGER,
  speech_patterns JSONB,
  role TEXT,
  role_description TEXT,
  mandate_rules JSONB,
  voice_private TEXT,
  voice_public TEXT,
  autonomy_auto TEXT,
  autonomy_require_approval TEXT,
  worldview TEXT,
  expertise JSONB,
  memory_policy TEXT,
  pet_peeves JSONB,
  voice_rules TEXT,
  active_projects TEXT,
  custom_core_truths JSONB,
  custom_boundaries JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_presets_source ON presets(source);
CREATE INDEX IF NOT EXISTS idx_presets_creature ON presets(creature);
CREATE INDEX IF NOT EXISTS idx_presets_name ON presets(name);

-- RLS
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read access' AND tablename = 'presets') THEN
    CREATE POLICY "Public read access" ON presets FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role write access' AND tablename = 'presets') THEN
    CREATE POLICY "Service role write access" ON presets FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;
`;

  // Use the Supabase SQL API
  const resp = await fetch(`${URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query: sql }),
  });

  if (!resp.ok) {
    // Try alternative: direct SQL endpoint
    const resp2 = await fetch(`${URL}/pg/sql`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ query: sql }),
    });

    if (!resp2.ok) {
      // Fallback: use postgREST to check if table exists
      const check = await fetch(`${URL}/rest/v1/presets?select=id&limit=1`, {
        headers: HEADERS,
      });
      if (check.ok) {
        console.log('  Table already exists (verified via query).');
        return true;
      }
      console.log('  SQL endpoint not available. Creating table via Supabase Dashboard required.');
      console.log('  But first, let me try upserting — the table might already exist...');
      return true;
    }
  }

  console.log('  Table created/verified.');
  return true;
}

// ─── Step 2: Load local presets ─────────────────────────────────────
function loadPresets(): any[] {
  const p = path.join(__dirname, '..', 'data', 'presets.ts');
  const raw = fs.readFileSync(p, 'utf-8');
  const m = raw.match(/export\s+const\s+presets\s*:\s*SoulPreset\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!m) throw new Error('Could not find presets array');
  return eval(m[1]);
}

// ─── Step 3: Convert to snake_case ──────────────────────────────────
function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

function convert(p: any): any {
  const r: any = {};
  for (const [k, v] of Object.entries(p)) {
    r[toSnake(k)] = v === undefined ? null : v;
  }
  if (!r.id) r.id = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') || '';
  return r;
}

// ─── Step 4: Upsert via REST ────────────────────────────────────────
async function upsert(presets: any[]) {
  console.log(`Step 2: Upserting ${presets.length} presets...`);

  const BATCH = 25;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < presets.length; i += BATCH) {
    const batch = presets.slice(i, i + BATCH).map(convert);

    const resp = await fetch(`${URL}/rest/v1/presets`, {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(batch),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error(`  Batch ${Math.floor(i / BATCH) + 1} (${resp.status}): ${body.slice(0, 200)}`);
      fail += batch.length;
    } else {
      ok += batch.length;
      process.stdout.write(`  ${ok}/${presets.length}\r`);
    }
  }

  console.log(`\n  Done: ${ok} upserted, ${fail} errors.`);
}

// ─── Step 5: Verify ─────────────────────────────────────────────────
async function verify() {
  console.log('Step 3: Verifying...');

  // Count
  const countResp = await fetch(`${URL}/rest/v1/presets?select=id`, {
    headers: { ...HEADERS, 'Prefer': 'count=exact' },
  });
  const countHeader = countResp.headers.get('content-range');
  const total = countHeader ? parseInt(countHeader.split('/')[1]) : 'unknown';
  console.log(`  Total in Supabase: ${total}`);

  // Check Orc
  const orcResp = await fetch(`${URL}/rest/v1/presets?id=eq.orc&select=name,knowledge_domains,signature_phrases,worldview`, {
    headers: HEADERS,
  });
  const orcData = await orcResp.json();
  if (orcData.length > 0) {
    const orc = orcData[0];
    console.log(`  Orc:`);
    console.log(`    domains: ${JSON.stringify(orc.knowledge_domains)}`);
    console.log(`    phrases: ${JSON.stringify(orc.signature_phrases?.slice(0, 2))}`);
    console.log(`    worldview: ${orc.worldview?.slice(0, 80)}`);
  } else {
    console.log('  Orc not found!');
  }
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log(`Supabase: ${URL}`);
  await createTable();
  const presets = loadPresets();
  console.log(`Loaded ${presets.length} local presets`);
  await upsert(presets);
  await verify();
  console.log('\n✅ Migration complete!');
}

main().catch(e => { console.error('Failed:', e.message); process.exit(1); });
