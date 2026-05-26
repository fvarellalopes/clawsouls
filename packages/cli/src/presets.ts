import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { PresetData } from './soulGenerator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Preset Loader ────────────────────────────────────────────────────
let _presets: PresetData[] | null = null;

export function loadPresets(): PresetData[] {
  if (_presets) return _presets;

  const candidates = [
    join(__dirname, '..', '..', '..', 'data', 'presets.ts'),
    join(process.cwd(), 'data', 'presets.ts'),
    join(process.cwd(), '..', '..', 'data', 'presets.ts'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      const content = readFileSync(candidate, 'utf-8');
      _presets = parsePresetsFromTS(content);
      return _presets;
    }
  }

  throw new Error('Could not find data/presets.ts — run agentsouls from the ClawSouls project root');
}

function parsePresetsFromTS(content: string): PresetData[] {
  const presets: PresetData[] = [];
  const presetRegex = /\{\s*id:\s*['"]([^'"]+)['"]/g;
  let match;
  const positions: number[] = [];
  while ((match = presetRegex.exec(content)) !== null) {
    positions.push(match.index);
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : content.length;
    const chunk = content.slice(start, end);
    try {
      const preset = parsePresetChunk(chunk);
      if (preset) presets.push(preset);
    } catch {}
  }
  return presets;
}

function parsePresetChunk(chunk: string): PresetData | null {
  const getStr = (key: string): string | undefined => {
    const m = chunk.match(new RegExp(`${key}:\\s*['"]([^'"]*?)['"]`));
    return m?.[1];
  };
  const getNum = (key: string): number | undefined => {
    const m = chunk.match(new RegExp(`${key}:\\s*(\\d+)`));
    return m ? parseInt(m[1]) : undefined;
  };
  const getStrArray = (key: string): string[] | undefined => {
    const m = chunk.match(new RegExp(`${key}:\\s*\\[([^\\]]*?)\\]`));
    if (!m) return undefined;
    return m[1].split(',').map(s => s.replace(/['"]/g, '').trim()).filter(Boolean);
  };

  const id = getStr('id');
  const name = getStr('name');
  if (!id || !name) return null;

  return {
    id, name,
    creature: getStr('creature') || 'Human',
    vibe: getStr('vibe') || '',
    emoji: getStr('emoji'),
    vibeStyle: getStr('vibeStyle'),
    humor: getNum('humor'),
    formality: getNum('formality'),
    emojiUsage: getNum('emojiUsage'),
    verbosity: getNum('verbosity'),
    consciousness: getNum('consciousness'),
    questioning: getNum('questioning'),
    openness: getNum('openness'),
    conscientiousness: getNum('conscientiousness'),
    extraversion: getNum('extraversion'),
    agreeableness: getNum('agreeableness'),
    neuroticism: getNum('neuroticism'),
    communicationMode: getStr('communicationMode'),
    knowledgeDomains: getStrArray('knowledgeDomains'),
    signaturePhrases: getStrArray('signaturePhrases'),
    emotionalRange: getNum('emotionalRange'),
    role: getStr('role'),
    roleDescription: getStr('roleDescription'),
    mandateRules: getStrArray('mandateRules'),
    voicePrivate: getStr('voicePrivate'),
    voicePublic: getStr('voicePublic'),
    autonomyAuto: getStr('autonomyAuto'),
    autonomyRequireApproval: getStr('autonomyRequireApproval'),
    worldview: getStr('worldview'),
    memoryPolicy: getStr('memoryPolicy'),
    petPeeves: getStrArray('petPeeves'),
    voiceRules: getStr('voiceRules'),
    customCoreTruths: getStrArray('customCoreTruths'),
    customBoundaries: getStrArray('customBoundaries'),
    description: getStr('description'),
    tags: getStrArray('tags'),
  };
}

export function searchPresets(query: string): PresetData[] {
  const presets = loadPresets();
  const q = query.toLowerCase();
  return presets.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.creature.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.tags?.some(t => t.toLowerCase().includes(q)) ||
    p.id.toLowerCase().includes(q)
  );
}

export function getPresetBySlug(slug: string): PresetData | undefined {
  return loadPresets().find(p => p.id === slug);
}

export function getAllPresets(): PresetData[] {
  return loadPresets();
}
