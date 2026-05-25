/**
 * Upsert enriched presets to Supabase via pg (direct connection).
 * Usage: node scripts/sync-presets-supabase.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const PW = 'g-A%24%25x22_%WHJUP';
const CONN = `postgresql://postgres:${PW}@db.qsnmcomdjreewaiwzzxl.supabase.co:5432/postgres`;

function loadPresets() {
  const p = path.join(__dirname, '..', 'data', 'presets.ts');
  const raw = fs.readFileSync(p, 'utf-8');
  const m = raw.match(/export\s+const\s+presets\s*:\s*SoulPreset\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!m) throw new Error('Could not find presets array');
  return eval(m[1]);
}

function toSnake(s) {
  return s.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

function convert(p) {
  const r = {};
  for (const [k, v] of Object.entries(p)) {
    r[toSnake(k)] = v === undefined ? null : v;
  }
  if (!r.id) r.id = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') || '';
  return r;
}

async function main() {
  const presets = loadPresets();
  console.log(`Loaded ${presets.length} presets`);

  const client = new Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Get all column names from the table
  const colRes = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'presets' ORDER BY ordinal_position"
  );
  const validCols = new Set(colRes.rows.map(r => r.column_name));

  // Convert and filter to valid columns only
  const converted = presets.map(convert).map(row => {
    const filtered = {};
    for (const [k, v] of Object.entries(row)) {
      if (validCols.has(k)) {
        // Convert objects/arrays to JSON strings for JSONB columns
        filtered[k] = (typeof v === 'object' && v !== null) ? JSON.stringify(v) : v;
      }
    }
    return filtered;
  });

  // Get column names from first row
  const cols = Object.keys(converted[0]);
  const placeholders = cols.map((_, i) => `$${i + 1}`);
  const updateSet = cols.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ');

  const sql = `
    INSERT INTO presets (${cols.join(', ')})
    VALUES (${placeholders.join(', ')})
    ON CONFLICT (id) DO UPDATE SET ${updateSet}
  `;

  console.log(`Upserting with ${cols.length} columns...`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < converted.length; i++) {
    const row = converted[i];
    const values = cols.map(c => row[c]);
    try {
      await client.query(sql, values);
      ok++;
      if (ok % 50 === 0) process.stdout.write(`  ${ok}/${presets.length}\r`);
    } catch (e) {
      fail++;
      if (fail <= 3) console.error(`  Error on ${row.id || i}: ${e.message.slice(0, 100)}`);
    }
  }

  console.log(`\nDone: ${ok} upserted, ${fail} errors`);

  // Verify
  const countRes = await client.query('SELECT count(*) FROM presets');
  console.log(`Total in Supabase: ${countRes.rows[0].count}`);

  const orcRes = await client.query(
    "SELECT name, knowledge_domains, signature_phrases, worldview FROM presets WHERE id = 'orc'"
  );
  if (orcRes.rows.length > 0) {
    const orc = orcRes.rows[0];
    console.log(`Orc domains: ${JSON.stringify(orc.knowledge_domains)}`);
    console.log(`Orc phrases: ${JSON.stringify(orc.signature_phrases?.slice(0, 2))}`);
    console.log(`Orc worldview: ${orc.worldview?.slice(0, 80)}`);
  }

  await client.end();
  console.log('\n✅ Sync complete!');
}

main().catch(e => { console.error('Failed:', e.message); process.exit(1); });
