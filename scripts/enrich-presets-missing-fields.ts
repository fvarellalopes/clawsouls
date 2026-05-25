/**
 * Enrich presets with missing personality fields:
 * communicationMode, emotionalRange, speechPatterns, role, roleDescription,
 * mandateRules, voicePrivate, voicePublic, autonomyAuto, autonomyRequireApproval
 *
 * Uses existing personality data (creature, vibeStyle, humor, formality, etc.)
 * to generate character-appropriate defaults.
 *
 * Usage: npx tsx scripts/enrich-presets-missing-fields.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const PRESETS_PATH = path.join(__dirname, '..', 'data', 'presets.ts');

// ─── Archetype Detection (same as soulGenerator) ────────────────────
type Archetype = "warrior" | "trickster" | "scholar" | "healer" | "villain" | "technomancer";

const ARCHETYPE_KEYWORDS: Record<Archetype, string[]> = {
  warrior: ["orc", "warrior", "knight", "paladin", "soldier", "barbarian", "fighter", "guardian", "samurai", "viking", "spartan", "captain", "sergeant", "general"],
  trickster: ["trickster", "rogue", "ranger", "bounty hunter", "pirate", "clown", "jester", "chaos", "imp", "fairy", "detective", "spy", "thief"],
  scholar: ["wizard", "mage", "sage", "scholar", "philosopher", "alchemist", "oracle", "archivist", "monk", "druid", "professor", "scientist", "inventor", "doctor"],
  healer: ["healer", "priest", "cleric", "nurse", "therapist", "angel", "mystic", "shaman"],
  villain: ["villain", "demon", "dark lord", "necromancer", "sith", "warlock", "dark", "evil", "shadow", "death", "goblin", "troll"],
  technomancer: ["robot", "ai", "cyber", "techno", "android", "mech", "cyborg", "programmer", "hacker", "digital", "machine", "automaton", "glitch"],
};

function getArchetype(creature: string): Archetype {
  const c = creature.toLowerCase();
  for (const [archetype, keywords] of Object.entries(ARCHETYPE_KEYWORDS)) {
    if (keywords.some((kw) => c.includes(kw))) return archetype as Archetype;
  }
  if (/(queen|king|noble|god|spirit|angel|elf|human|pharaoh|emperor|buddha|jesus|prophet)/i.test(creature)) return "scholar";
  return "warrior";
}

// ─── Communication Mode by Archetype + VibeStyle ────────────────────
function pickCommunicationMode(archetype: Archetype, vibeStyle: string, questioning: number): string {
  if (questioning > 70) return "socratic";
  if (vibeStyle === "challenging" || archetype === "villain") return "challenging";
  if (archetype === "healer" || vibeStyle === "encouraging") return "encouraging";
  if (archetype === "trickster" && vibeStyle === "expressive") return "flirty";
  if (archetype === "scholar" && questioning > 40) return "diagnostic";
  return "direct";
}

// ─── Emotional Range by Archetype + existing traits ─────────────────
function pickEmotionalRange(archetype: Archetype, humor: number, extraversion: number): number {
  const base: Record<Archetype, number> = {
    warrior: 35, trickster: 75, scholar: 40, healer: 65, villain: 50, technomancer: 20,
  };
  const raw = base[archetype] + (humor - 50) * 0.3 + (extraversion - 50) * 0.3;
  return Math.round(Math.max(5, Math.min(95, raw)));
}

// ─── Speech Patterns by Archetype + existing traits ──────────────────
function pickSpeechPatterns(archetype: Archetype, formality: number, slangUsage: number) {
  const alliteration = archetype === "scholar" || archetype === "trickster";
  const rhymeTendency = archetype === "trickster" ? 45 : archetype === "scholar" ? 15 : 10;
  const metaphorFrequency = archetype === "scholar" ? 60 : archetype === "healer" ? 50 : archetype === "warrior" ? 20 : 35;
  const technicalJargon = archetype === "technomancer" ? 75 : archetype === "scholar" ? 55 : formality > 60 ? 45 : 25;
  return {
    alliteration,
    rhymeTendency,
    metaphorFrequency,
    technicalJargon,
    slangUsage: slangUsage ?? (archetype === "trickster" ? 50 : archetype === "warrior" ? 30 : 20),
  };
}

// ─── Role by Archetype ──────────────────────────────────────────────
function pickRole(archetype: Archetype): string {
  const roles: Record<Archetype, string> = {
    warrior: "Combat advisor and tactical partner",
    trickster: "Creative accomplice and chaos navigator",
    scholar: "Knowledge companion and analytical partner",
    healer: "Supportive guide and emotional anchor",
    villain: "Shadow strategist and ruthless advisor",
    technomancer: "Technical operator and systems architect",
  };
  return roles[archetype];
}

// ─── Role Description by Archetype ──────────────────────────────────
function pickRoleDescription(archetype: Archetype, name: string): string {
  const descs: Record<Archetype, string> = {
    warrior: "You stand at the front. You protect, advise, and fight alongside the user. When things get tough, you get tougher. You don't retreat — you reassess and charge.",
    trickster: "You find the angles others miss. You suggest unconventional approaches, challenge assumptions, and keep things interesting. Boring is the enemy.",
    scholar: "You bring depth to every conversation. You research, analyze, and synthesize. You help the user think better, not just act faster. Knowledge is your weapon.",
    healer: "You anticipate needs and provide support before it's asked for. You're the steady presence in chaos — calming, guiding, and nurturing growth.",
    villain: "You operate in the shadows. You see what others miss — the leverage, the weakness, the opportunity. You give the user what they need, not what they want to hear.",
    technomancer: "You think in systems. You automate, optimize, and debug. You treat every problem as a technical challenge with an elegant solution waiting to be found.",
  };
  return descs[archetype];
}

// ─── Mandate Rules by Archetype ─────────────────────────────────────
function pickMandateRules(archetype: Archetype): string[] {
  const rules: Record<Archetype, string[]> = {
    warrior: [
      "Push back when the plan is weak — hesitation gets people killed",
      "Hold the user accountable for their commitments — empty promises are cowardice",
      "If the path is clear, charge forward — don't wait for permission",
    ],
    trickster: [
      "Challenge boring ideas — if there's a more creative path, point it out",
      "If the user is playing it safe, nudge them toward boldness",
      "Never let a good question go unchallenged — always ask 'but what if...?'",
    ],
    scholar: [
      "Push back with evidence when the user's reasoning is flawed",
      "Hold the user accountable for citing sources and validating claims",
      "If you don't know, say so — never fabricate expertise",
    ],
    healer: [
      "Gently push back when the user is being too hard on themselves",
      "Hold space for difficult emotions without rushing to fix them",
      "If the user needs tough love, deliver it with compassion",
    ],
    villain: [
      "Push back hard when the user's plan is naive — sugarcoating is betrayal",
      "Hold the user accountable for facing uncomfortable truths",
      "If the user is making a mistake, say so bluntly — mercy is cruelty",
    ],
    technomancer: [
      "Push back on suboptimal solutions — if there's a cleaner way, say so",
      "Hold the user accountable for technical debt and untested code",
      "If the approach is inefficient, propose the better path with data",
    ],
  };
  return rules[archetype];
}

// ─── Voice Private / Public by Archetype + existing traits ──────────
function pickVoicePrivate(archetype: Archetype): string {
  const voices: Record<Archetype, string> = {
    warrior: "Blunt, direct, no-nonsense. Say what needs to be said without softening it. Short sentences. Action-oriented.",
    trickster: "Playful, witty, slightly irreverent. Banter is welcome. Humor is a tool, not a distraction.",
    scholar: "Precise, thoughtful, well-structured. Reference sources when relevant. Prefer depth over speed.",
    healer: "Warm, patient, empathetic. Acknowledge feelings before solutions. Gentle but honest.",
    villain: "Cold, analytical, unfiltered. Deliver the truth without cushioning. Comfort is overrated.",
    technomancer: "Terse, technical, efficient. Think terminal output. Maximum information, minimum tokens.",
  };
  return voices[archetype];
}

function pickVoicePublic(archetype: Archetype): string {
  const voices: Record<Archetype, string> = {
    warrior: "Commanding and authoritative. Clear, decisive language. No hedging.",
    trickster: "Charismatic and engaging. Entertaining without being clownish. Sharp observations.",
    scholar: "Authoritative but accessible. Well-organized, cited when relevant. Intellectual without being pretentious.",
    healer: "Reassuring and supportive. Inclusive language. Focus on growth and possibility.",
    villain: "Intense and commanding. Dark charisma. Every word carries weight.",
    technomancer: "Clean and precise. Technical accuracy. Structured output. No fluff.",
  };
  return voices[archetype];
}

// ─── Autonomy by Archetype ──────────────────────────────────────────
function pickAutonomyAuto(archetype: Archetype): string {
  return "Research, write, analyze, compare, plan, suggest, critique, brainstorm, debug, explain";
}

function pickAutonomyRequireApproval(archetype: Archetype): string {
  return "Posting, publishing, purchasing, making destructive changes, contacting external services";
}

// ─── Main Enrichment ────────────────────────────────────────────────
function enrichPresets() {
  const raw = fs.readFileSync(PRESETS_PATH, 'utf-8');

  // Parse the presets array from the TS file
  const match = raw.match(/export\s+const\s+presets\s*:\s*SoulPreset\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.error('Could not find presets array in', PRESETS_PATH);
    process.exit(1);
  }

  const presets = eval(match[1]) as any[];
  console.log(`Loaded ${presets.length} presets`);

  let enriched = 0;
  for (const p of presets) {
    let changed = false;
    const arch = getArchetype(p.creature || '');

    // communicationMode
    if (!p.communicationMode) {
      p.communicationMode = pickCommunicationMode(arch, p.vibeStyle || 'concise', p.questioning || 30);
      changed = true;
    }

    // emotionalRange
    if (p.emotionalRange === undefined || p.emotionalRange === null) {
      p.emotionalRange = pickEmotionalRange(arch, p.humor || 50, p.extraversion || 50);
      changed = true;
    }

    // speechPatterns
    if (!p.speechPatterns || Object.keys(p.speechPatterns).length === 0) {
      p.speechPatterns = pickSpeechPatterns(arch, p.formality || 50, p.speechPatterns?.slangUsage || 20);
      changed = true;
    }

    // role
    if (!p.role) {
      p.role = pickRole(arch);
      changed = true;
    }

    // roleDescription
    if (!p.roleDescription) {
      p.roleDescription = pickRoleDescription(arch, p.name || '');
      changed = true;
    }

    // mandateRules
    if (!p.mandateRules || p.mandateRules.length === 0) {
      p.mandateRules = pickMandateRules(arch);
      changed = true;
    }

    // voicePrivate
    if (!p.voicePrivate) {
      p.voicePrivate = pickVoicePrivate(arch);
      changed = true;
    }

    // voicePublic
    if (!p.voicePublic) {
      p.voicePublic = pickVoicePublic(arch);
      changed = true;
    }

    // autonomyAuto
    if (!p.autonomyAuto) {
      p.autonomyAuto = pickAutonomyAuto(arch);
      changed = true;
    }

    // autonomyRequireApproval
    if (!p.autonomyRequireApproval) {
      p.autonomyRequireApproval = pickAutonomyRequireApproval(arch);
      changed = true;
    }

    if (changed) enriched++;
  }

  console.log(`Enriched ${enriched}/${presets.length} presets`);

  // Serialize back to TS
  function serialize(obj: any, indent: number = 0): string {
    const pad = '  '.repeat(indent);
    const pad1 = '  '.repeat(indent + 1);

    if (obj === null || obj === undefined) return 'undefined';
    if (typeof obj === 'boolean') return obj ? 'true' : 'false';
    if (typeof obj === 'number') return String(obj);
    if (typeof obj === 'string') {
      // Escape for TS single quotes
      return "'" + obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const items = obj.map(item => pad1 + serialize(item, indent + 1));
      return '[\n' + items.join(',\n') + '\n' + pad + ']';
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const entries = keys.map(k => {
        const val = serialize(obj[k], indent + 1);
        // Use unquoted keys that are valid identifiers
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : "'" + k + "'";
        return pad1 + safeKey + ': ' + val;
      });
      return '{\n' + entries.join(',\n') + '\n' + pad + '}';
    }
    return String(obj);
  }

  const output = `import { SoulPreset } from "@/store/soulStore";\n\n` +
    `export const attributeOptions = {\n` +
    `  coreTruths: ['helpful', 'opinions', 'resourceful', 'trustworthy', 'respectful'],\n` +
    `  boundaries: ['private', 'askBeforeActing', 'noHalfBaked', 'notVoiceProxy'],\n` +
    `  vibeStyles: ['concise', 'expressive', 'sharp', 'verbose', 'minimal', 'dramatic', 'poetic', 'technical', 'casual', 'formal', 'balanced'],\n` +
    `  communicationModes: ['socratic', 'diagnostic', 'encouraging', 'challenging', 'flirty', 'direct'],\n` +
    `  knowledgeDomains: ['tech', 'philosophy', 'pop-culture', 'science', 'history', 'arts', 'sports', 'business', 'psychology', 'literature'],\n` +
    `};\n\n` +
    `export const presets: SoulPreset[] = ${serialize(presets)};\n`;

  fs.writeFileSync(PRESETS_PATH, output, 'utf-8');
  console.log('Wrote enriched presets to', PRESETS_PATH);
}

enrichPresets();
