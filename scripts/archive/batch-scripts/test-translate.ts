/**
 * Quick test: translate 2 presets to PT and insert into Supabase.
 * Uses curl for API calls (to avoid Node.js fetch gzip issues with OpenGateway).
 * Run: npx tsx scripts/test-translate.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Load env
for (const envPath of [
  path.join(__dirname, '..', '.env.local'),
  path.join(process.env.HOME || '~', '.hermes', '.env'),
]) {
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
const API_KEY = process.env.GITLAWB_API_KEY || '';

function curlPost(url: string, body: string, headers: Record<string, string>): string {
  const headerArgs = Object.entries(headers).map(([k, v]) => `-H "${k}: ${v}"`).join(' ');
  const cmd = `curl -s -m 60 ${headerArgs} -d '${body.replace(/'/g, "'\\''")}' "${url}"`;
  return execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
}

async function main() {
  console.log('Testing translation pipeline (curl-based)...');
  console.log(`Supabase URL: ${URL.slice(0, 30)}...`);

  // 1. Fetch 2 presets from Supabase
  console.log('\n1. Fetching 2 presets...');
  const presRes = curlPost(
    `${URL}/rest/v1/presets?select=id,name,description,creature,vibe,tags&limit=2&order=id`,
    '',
    { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  );
  const presets = JSON.parse(presRes);
  console.log(`   Got ${presets.length} presets: ${presets.map((p: any) => p.id).join(', ')}`);

  // 2. Translate
  console.log('\n2. Translating to PT...');
  const input = presets.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    creature: p.creature,
    vibe: p.vibe,
    tags: p.tags,
  }));

  const prompt = `Translate to Portuguese (Brazil). Return ONLY valid JSON array, no markdown.
Input: ${JSON.stringify(input)}`;

  const transBody = JSON.stringify({
    model: 'mimo-v2.5',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
    temperature: 0.2,
  });

  const transRes = curlPost('https://opengateway.gitlawb.com/v1/chat/completions', transBody, {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  });

  const transData = JSON.parse(transRes);
  const content = transData.choices?.[0]?.message?.content || '';
  console.log(`   Raw response length: ${content.length} chars`);

  if (!content) {
    console.error('   Empty response!');
    console.log('   Full response:', JSON.stringify(transData, null, 2).slice(0, 500));
    return;
  }

  // Parse JSON (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('   Failed to parse JSON from response');
    console.log('   Response:', content.slice(0, 300));
    return;
  }

  const translations = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  console.log(`   Parsed ${translations.length} translations`);
  console.log('   Sample:', JSON.stringify(translations[0], null, 2));

  // 3. Insert into Supabase
  console.log('\n3. Inserting translations...');
  const rows = translations.map((t: any) => ({
    preset_id: t.id,
    locale: 'pt',
    name: t.name,
    description: t.description,
    creature: t.creature,
    vibe: t.vibe,
    tags: JSON.stringify(t.tags || []),
  }));

  const insertRes = curlPost(
    `${URL}/rest/v1/preset_translations`,
    JSON.stringify(rows),
    {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    }
  );

  console.log(`   Insert response: ${insertRes.slice(0, 200)}`);

  // 4. Verify
  console.log('\n4. Verifying...');
  const verifyRes = curlPost(
    `${URL}/rest/v1/preset_translations?select=preset_id,name,locale&locale=eq.pt&limit=5`,
    '',
    { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  );
  const verifyData = JSON.parse(verifyRes);
  console.log(`   Found ${verifyData.length} translations in DB`);
  for (const row of verifyData) {
    console.log(`   - ${row.preset_id}: ${row.name} (${row.locale})`);
  }
}

main().catch(console.error);
