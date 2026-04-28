import { SoulState, SoulPreset } from "@/store/soulStore";

type SoulData = SoulState["soul"] | SoulPreset;

/**
 * Calculate compatibility percentage between two soul configurations.
 * Compares tone attributes and Big Five traits.
 */
export function calculateCompatibility(a: SoulData, b: SoulData): {
  overall: number;
  breakdown: {
    tone: number;
    personality: number;
    style: number;
  };
  topSimilar: string[];
  topDifferent: string[];
} {
  // Tone comparison
  const toneAttrs = ["humor", "formality", "emojiUsage", "verbosity", "consciousness", "questioning"] as const;
  let toneScore = 0;
  let toneCount = 0;

  for (const attr of toneAttrs) {
    const aVal = (a as any)[attr];
    const bVal = (b as any)[attr];
    if (aVal !== undefined && bVal !== undefined) {
      const diff = Math.abs(aVal - bVal);
      toneScore += 100 - diff;
      toneCount++;
    }
  }

  // Personality (Big Five) comparison
  const bigFive = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"] as const;
  let personalityScore = 0;
  let personalityCount = 0;

  for (const trait of bigFive) {
    const aVal = (a as any)[trait];
    const bVal = (b as any)[trait];
    if (aVal !== undefined && bVal !== undefined) {
      const diff = Math.abs(aVal - bVal);
      personalityScore += 100 - diff;
      personalityCount++;
    }
  }

  // Style comparison (vibeStyle match)
  const styleMatch = a.vibeStyle === b.vibeStyle ? 100 : 0;

  // Core truths overlap
  const aTruths = Object.entries(a.coreTruths).filter(([, v]) => v).map(([k]) => k);
  const bTruths = Object.entries(b.coreTruths).filter(([, v]) => v).map(([k]) => k);
  const truthsOverlap = aTruths.filter((t) => bTruths.includes(t)).length;
  const truthsTotal = new Set([...aTruths, ...bTruths]).size;
  const truthsScore = truthsTotal > 0 ? (truthsOverlap / truthsTotal) * 100 : 50;

  // Calculate overall
  const toneAvg = toneCount > 0 ? toneScore / toneCount : 50;
  const personalityAvg = personalityCount > 0 ? personalityScore / personalityCount : 50;
  const overall = Math.round(toneAvg * 0.3 + personalityAvg * 0.4 + styleMatch * 0.15 + truthsScore * 0.15);

  // Find top similar and different traits
  const allScores: { name: string; similarity: number }[] = [];

  for (const attr of toneAttrs) {
    const aVal = (a as any)[attr];
    const bVal = (b as any)[attr];
    if (aVal !== undefined && bVal !== undefined) {
      allScores.push({ name: attr, similarity: 100 - Math.abs(aVal - bVal) });
    }
  }

  for (const trait of bigFive) {
    const aVal = (a as any)[trait];
    const bVal = (b as any)[trait];
    if (aVal !== undefined && bVal !== undefined) {
      allScores.push({ name: trait, similarity: 100 - Math.abs(aVal - bVal) });
    }
  }

  allScores.sort((a, b) => b.similarity - a.similarity);
  const topSimilar = allScores.slice(0, 3).map((s) => s.name);
  const topDifferent = allScores.slice(-3).reverse().map((s) => s.name);

  return {
    overall: Math.min(100, Math.max(0, overall)),
    breakdown: {
      tone: Math.round(toneAvg),
      personality: Math.round(personalityAvg),
      style: styleMatch,
    },
    topSimilar,
    topDifferent,
  };
}

/**
 * Find the most compatible preset for a given soul configuration.
 */
export function findMostCompatible(
  soul: SoulData,
  presets: SoulPreset[]
): { preset: SoulPreset; compatibility: ReturnType<typeof calculateCompatibility> } | null {
  if (presets.length === 0) return null;

  let best = { preset: presets[0], score: 0, compatibility: calculateCompatibility(soul, presets[0]) };

  for (const preset of presets) {
    const compat = calculateCompatibility(soul, preset);
    if (compat.overall > best.score) {
      best = { preset, score: compat.overall, compatibility: compat };
    }
  }

  return { preset: best.preset, compatibility: best.compatibility };
}
