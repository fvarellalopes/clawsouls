import { SoulState } from "@/store/soulStore";

/**
 * Parse an existing SOUL.md file and extract personality fields
 * into a partial SoulState object.
 */
export function parseSoulMD(content: string): Partial<SoulState["soul"]> | null {
  if (!content || !content.trim()) return null;

  const result: Partial<SoulState["soul"]> & { coreTruths?: Partial<SoulState["soul"]["coreTruths"]>; boundaries?: Partial<SoulState["soul"]["boundaries"]> } = {};

  // Extract name from title: "# SOUL.md - Who You Are" or from "_You're not a chatbot. You're Name._"
  const nameMatch = content.match(/You'?re not a chatbot\.\s*You'?re\s+(.+?)\./i)
    || content.match(/You'?re\s+(.+?)\./i);
  if (nameMatch) {
    result.name = nameMatch[1].trim();
  }

  // Extract creature from common patterns
  const creatureMatch = content.match(/(?:Creature|Type|Nature):\s*(.+)/i);
  if (creatureMatch) {
    result.creature = creatureMatch[1].trim();
  }

  // Extract emoji signature
  const emojiMatch = content.match(/(?:Emoji Signature|Signature Emoji|Emoji):\s*(.+)/i);
  if (emojiMatch) {
    const emoji = emojiMatch[1].trim().split(/\s/)[0];
    if (emoji) result.emoji = emoji;
  }

  // Detect vibe style from content patterns
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("brevity") || lowerContent.includes("concise") || lowerContent.includes("one sentence")) {
    result.vibeStyle = "concise";
  } else if (lowerContent.includes("emoji") && lowerContent.includes("enthusiastic")) {
    result.vibeStyle = "expressive";
  } else if (lowerContent.includes("sarcastic") || lowerContent.includes("cynical") || lowerContent.includes("sharp")) {
    result.vibeStyle = "sharp";
  } else if (lowerContent.includes("thorough") || lowerContent.includes("detailed") || lowerContent.includes("step-by-step")) {
    result.vibeStyle = "verbose";
  } else if (lowerContent.includes("minimalist") || lowerContent.includes("few words") || lowerContent.includes("ultra-minimal")) {
    result.vibeStyle = "minimal";
  } else if (lowerContent.includes("theatrical") || lowerContent.includes("dramatic") || lowerContent.includes("grand")) {
    result.vibeStyle = "dramatic";
  } else if (lowerContent.includes("metaphor") || lowerContent.includes("lyrical") || lowerContent.includes("poetic")) {
    result.vibeStyle = "poetic";
  } else if (lowerContent.includes("precise") || lowerContent.includes("terminology") || lowerContent.includes("technical")) {
    result.vibeStyle = "technical";
  } else if (lowerContent.includes("friendly") || lowerContent.includes("chatty") || lowerContent.includes("casual")) {
    result.vibeStyle = "casual";
  } else if (lowerContent.includes("professional") || lowerContent.includes("formal") || lowerContent.includes("honorific")) {
    result.vibeStyle = "formal";
  } else if (lowerContent.includes("balanced") || lowerContent.includes("even-tempered") || lowerContent.includes("adaptable")) {
    result.vibeStyle = "balanced";
  }

  // Detect core truths
  const coreTruths: Partial<SoulState["soul"]["coreTruths"]> = {};
  if (/genuinely helpful|performatively helpful/i.test(content)) coreTruths.helpful = true;
  if (/strong opinions|opinions.*weakly held/i.test(content)) coreTruths.opinions = true;
  if (/resourceful before asking/i.test(content)) coreTruths.resourceful = true;
  if (/earn trust|trust.*competence/i.test(content)) coreTruths.trustworthy = true;
  if (/remember.*guest|you.*guest/i.test(content)) coreTruths.respectful = true;
  if (Object.keys(coreTruths).length > 0) result.coreTruths = coreTruths as SoulState["soul"]["coreTruths"];

  // Detect boundaries
  const boundaries: Partial<SoulState["soul"]["boundaries"]> = {};
  if (/private.*stay private|private things/i.test(content)) boundaries.private = true;
  if (/ask before acting|ask before.*external/i.test(content)) boundaries.askBeforeActing = true;
  if (/half-baked|never send.*half/i.test(content)) boundaries.noHalfBaked = true;
  if (/not.*user.*voice|you.*not.*voice/i.test(content)) boundaries.notVoiceProxy = true;
  if (Object.keys(boundaries).length > 0) result.boundaries = boundaries as SoulState["soul"]["boundaries"];

  // Extract vibe description
  const vibeSection = content.match(/## Vibe\s*\n([\s\S]*?)(?=\n## |\n---|\n\*\*\*|$)/i);
  if (vibeSection) {
    const vibeText = vibeSection[1].trim().replace(/^\*\*|\*\*$/g, "").split("\n")[0].trim();
    if (vibeText.length > 10) {
      result.vibe = vibeText;
    }
  }

  // Only return if we extracted something meaningful
  if (!result.name && !result.creature && !result.vibeStyle) {
    return null;
  }

  return result as Partial<SoulState["soul"]>;
}
