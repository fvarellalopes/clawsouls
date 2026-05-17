/**
 * Karma Calculator — evaluates how "well-tuned" a preset is.
 *
 * Factors:
 *  1. Personality balance (Big Five spread — too extreme = low karma)
 *  2. Vibe quality (length, coherence indicators)
 *  3. Community rating (likes vs dislikes, star average)
 *  4. Completeness (all fields filled)
 *
 * Score: 0-100
 *  - 0-30:  "Unstable"  — shows LLM critique
 *  - 31-60: "Developing" — shows hints
 *  - 61-100: "Refined"   — green badge
 */

import { SoulPreset } from "@/store/soulStore";

export interface KarmaResult {
  score: number;           // 0-100
  label: string;           // "Unstable" | "Developing" | "Refined"
  color: string;           // red/yellow/green
  icon: string;            // material icon
  breakdown: {
    personality: number;   // 0-30
    vibe: number;          // 0-25
    completeness: number;  // 0-25
    community: number;     // 0-20
  };
  shouldCritique: boolean; // score < 35
  issues: string[];        // specific problems found
}

// --- Helpers ---

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function bigFiveRange(p: SoulPreset): number {
  const vals = [
    p.openness ?? 50,
    p.conscientiousness ?? 50,
    p.extraversion ?? 50,
    p.agreeableness ?? 50,
    p.neuroticism ?? 30,
  ];
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return max - min; // 0-100, wider range = more extreme
}

function isFlat(p: SoulPreset): boolean {
  const vals = [
    p.openness ?? 50,
    p.conscientiousness ?? 50,
    p.extraversion ?? 50,
    p.agreeableness ?? 50,
    p.neuroticism ?? 30,
  ];
  const variance = vals.reduce((sum, v) => {
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return sum + (v - mean) ** 2;
  }, 0) / vals.length;
  return variance < 50; // very flat = boring preset
}

// --- Main ---

export function calculateKarma(
  preset: SoulPreset,
  communityLikes: number = 0,
  communityDislikes: number = 0,
  avgStars: number = 0
): KarmaResult {
  const issues: string[] = [];
  const range = bigFiveRange(preset);
  const flat = isFlat(preset);

  // --- 1. Personality balance (0-30) ---
  let personality = 15; // neutral start

  if (flat) {
    personality -= 10;
    issues.push("personalityFlat");
  }
  if (range > 85) {
    personality -= 8;
    issues.push("personalityExtreme");
  }
  if (range >= 30 && range <= 70 && !flat) {
    personality += 15; // sweet spot
  }
  personality = clamp(personality, 0, 30);

  // --- 2. Vibe quality (0-25) ---
  let vibe = 10;
  const vibeLen = (preset.vibe || "").length;

  if (vibeLen > 80) vibe += 8;
  else if (vibeLen > 30) vibe += 4;
  else if (vibeLen < 10) {
    vibe -= 5;
    issues.push("vibeTooShort");
  }

  if ((preset.signaturePhrases?.length ?? 0) >= 3) vibe += 5;
  else if ((preset.signaturePhrases?.length ?? 0) >= 1) vibe += 2;

  if ((preset.knowledgeDomains?.length ?? 0) >= 2) vibe += 3;

  vibe = clamp(vibe, 0, 25);

  // --- 3. Completeness (0-25) ---
  let completeness = 0;

  if (preset.name) completeness += 3;
  if (preset.creature) completeness += 3;
  if (preset.description && preset.description.length > 20) completeness += 5;
  if (preset.vibe && preset.vibe.length > 10) completeness += 4;
  if (preset.tags?.length > 0) completeness += 2;
  if (preset.emoji) completeness += 2;
  if (preset.avatar) completeness += 2;
  if (preset.communicationMode) completeness += 2;
  if (preset.role || preset.roleDescription) completeness += 2;

  completeness = clamp(completeness, 0, 25);

  // --- 4. Community (0-20) ---
  let community = 10; // neutral
  const totalVotes = communityLikes + communityDislikes;

  if (totalVotes > 0) {
    const likeRatio = communityLikes / totalVotes;
    community = likeRatio * 15; // 0-15 based on ratio
    if (totalVotes >= 10) community += 3; // bonus for volume
    if (totalVotes >= 50) community += 2;
  }

  if (avgStars >= 4) community += 3;
  else if (avgStars >= 3) community += 1;

  community = clamp(community, 0, 20);

  // --- Total ---
  const score = Math.round(personality + vibe + completeness + community);

  let label: string;
  let color: string;
  let icon: string;

  if (score <= 30) {
    label = "Unstable";
    color = "var(--destructive)";
    icon = "warning";
  } else if (score <= 60) {
    label = "Developing";
    color = "var(--primary)";
    icon = "trending_up";
  } else {
    label = "Refined";
    color = "rgb(34,197,94)";
    icon = "verified";
  }

  return {
    score: clamp(score, 0, 100),
    label,
    color,
    icon,
    breakdown: { personality, vibe, completeness, community },
    shouldCritique: score < 35,
    issues,
  };
}
