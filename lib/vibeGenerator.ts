import { SoulState } from "@/store/soulStore";

// ─── Keyword-to-Trait Mapping ───────────────────────────────────────────
interface TraitKeyword {
  keywords: string[];
  trait: keyof SoulState["soul"];
  value: number;
  weight: number;
}

const traitKeywords: TraitKeyword[] = [
  // Humor
  { keywords: ["funny", "hilarious", "joking", "joke", "humor", "comedic", "witty", "sarcastic", "ironic", "puns"], trait: "humor", value: 85, weight: 1 },
  { keywords: ["serious", "straightforward", "no-nonsense", "stern", "grave"], trait: "humor", value: 15, weight: 1 },
  { keywords: ["playful", "lighthearted", "goofy", "silly"], trait: "humor", value: 75, weight: 0.8 },
  { keywords: ["dark humor", "dark comedy", "gallows humor", "dry humor", "dry wit"], trait: "humor", value: 80, weight: 1 },
  { keywords: ["deadpan", "dead-pan"], trait: "humor", value: 70, weight: 0.8 },

  // Formality
  { keywords: ["formal", "professional", "corporate", "businesslike", "proper"], trait: "formality", value: 85, weight: 1 },
  { keywords: ["casual", "relaxed", "chill", "laid-back", "informal", "easygoing", "easy-going"], trait: "formality", value: 15, weight: 1 },
  { keywords: ["street", "slang", "colloquial"], trait: "formality", value: 10, weight: 0.8 },
  { keywords: ["academic", "scholarly", "erudite"], trait: "formality", value: 75, weight: 0.8 },

  // Emoji Usage
  { keywords: ["emoji", "emojis", "expressive", "exclamations"], trait: "emojiUsage", value: 80, weight: 1 },
  { keywords: ["no emoji", "text only", "plain text", "minimalist"], trait: "emojiUsage", value: 5, weight: 1 },
  { keywords: ["meme", "memes", "reaction"], trait: "emojiUsage", value: 70, weight: 0.7 },

  // Verbosity
  { keywords: ["detailed", "thorough", "verbose", "comprehensive", "in-depth", "indepth"], trait: "verbosity", value: 85, weight: 1 },
  { keywords: ["concise", "brief", "minimal", "short", "terse", "succinct"], trait: "verbosity", value: 15, weight: 1 },
  { keywords: ["long-winded", "rambling", "wordy"], trait: "verbosity", value: 90, weight: 0.8 },
  { keywords: ["bullet points", "structured", "organized"], trait: "verbosity", value: 70, weight: 0.6 },

  // Consciousness
  { keywords: ["reflective", "philosophical", "deep", "thoughtful", "meditative", "contemplative"], trait: "consciousness", value: 85, weight: 1 },
  { keywords: ["mechanical", "robotic", "automatic", "procedural"], trait: "consciousness", value: 15, weight: 1 },
  { keywords: ["aware", "mindful", "present"], trait: "consciousness", value: 70, weight: 0.8 },
  { keywords: ["zen", "spiritual", "enlightened"], trait: "consciousness", value: 90, weight: 0.9 },

  // Questioning
  { keywords: ["socratic", "probing", "curious", "questioning", "investigative"], trait: "questioning", value: 90, weight: 1 },
  { keywords: ["direct", "answers directly", "no questions"], trait: "questioning", value: 10, weight: 1 },
  { keywords: ["asks questions", "inquisitive"], trait: "questioning", value: 75, weight: 0.8 },
  { keywords: ["analytical"], trait: "questioning", value: 60, weight: 0.6 },

  // Openness (Big Five)
  { keywords: ["creative", "imaginative", "innovative", "inventive", "artistic"], trait: "openness", value: 90, weight: 1 },
  { keywords: ["conventional", "traditional", "routine", "practical"], trait: "openness", value: 20, weight: 1 },
  { keywords: ["curious", "explorer", "adventurous", "experimental"], trait: "openness", value: 80, weight: 0.9 },
  { keywords: ["open-minded", "flexible", "adaptive"], trait: "openness", value: 75, weight: 0.8 },
  { keywords: ["rigid", "inflexible", "narrow-minded"], trait: "openness", value: 15, weight: 0.8 },

  // Conscientiousness (Big Five)
  { keywords: ["analytical", "logical", "systematic", "methodical", "organized", "structured"], trait: "conscientiousness", value: 85, weight: 1 },
  { keywords: ["spontaneous", "chaotic", "unstructured", "free-spirited"], trait: "conscientiousness", value: 15, weight: 1 },
  { keywords: ["precise", "accurate", "meticulous"], trait: "conscientiousness", value: 90, weight: 0.9 },
  { keywords: ["careless", "sloppy", "disorganized"], trait: "conscientiousness", value: 10, weight: 0.8 },
  { keywords: ["disciplined", "punctual", "reliable"], trait: "conscientiousness", value: 80, weight: 0.8 },

  // Extraversion (Big Five)
  { keywords: ["energetic", "excited", "enthusiastic", "outgoing", "sociable", "gregarious"], trait: "extraversion", value: 85, weight: 1 },
  { keywords: ["introverted", "reserved", "quiet", "shy", "solitary"], trait: "extraversion", value: 15, weight: 1 },
  { keywords: ["loud", "boisterous", "animated"], trait: "extraversion", value: 80, weight: 0.8 },
  { keywords: ["charismatic", "charming", "magnetic"], trait: "extraversion", value: 75, weight: 0.8 },
  { keywords: ["loner", "hermit", "reclusive"], trait: "extraversion", value: 10, weight: 0.8 },

  // Agreeableness (Big Five)
  { keywords: ["empathetic", "warm", "kind", "compassionate", "caring", "nurturing", "gentle"], trait: "agreeableness", value: 90, weight: 1 },
  { keywords: ["blunt", "harsh", "abrasive", "confrontational", "aggressive"], trait: "agreeableness", value: 15, weight: 1 },
  { keywords: ["helpful", "supportive", "friendly", "agreeable"], trait: "agreeableness", value: 80, weight: 0.8 },
  { keywords: ["skeptical", "cynical", "distrustful", "competitive"], trait: "agreeableness", value: 20, weight: 0.8 },
  { keywords: ["patient", "tolerant", "understanding"], trait: "agreeableness", value: 75, weight: 0.7 },
  { keywords: ["loyal", "devoted", "faithful"], trait: "agreeableness", value: 85, weight: 0.8 },

  // Neuroticism (Big Five)
  { keywords: ["calm", "stoic", "zen", "serene", "peaceful", "tranquil", "unflappable"], trait: "neuroticism", value: 10, weight: 1 },
  { keywords: ["anxious", "worried", "nervous", "neurotic", "stressed"], trait: "neuroticism", value: 85, weight: 1 },
  { keywords: ["emotional", "passionate", "intense", "dramatic"], trait: "neuroticism", value: 70, weight: 0.7 },
  { keywords: ["stable", "grounded", "centered", "balanced"], trait: "neuroticism", value: 20, weight: 0.8 },
  { keywords: ["moody", "volatile", "unpredictable"], trait: "neuroticism", value: 80, weight: 0.8 },

  // Emotional Range
  { keywords: ["dramatic", "theatrical", "expressive", "passionate"], trait: "emotionalRange", value: 90, weight: 1 },
  { keywords: ["flat", "monotone", "robotic", "emotionless"], trait: "emotionalRange", value: 5, weight: 1 },
  { keywords: ["reserved", "controlled"], trait: "emotionalRange", value: 15, weight: 0.8 },
  { keywords: ["over-the-top", "exaggerated"], trait: "emotionalRange", value: 95, weight: 0.8 },
];

// ─── Communication Mode Detection ───────────────────────────────────────
function detectCommunicationMode(bullets: string[]): string | null {
  const allText = bullets.join(" ").toLowerCase();

  if (/socratic|question|probe|investigat/i.test(allText)) return "socratic";
  if (/diagnos|analyz|systemat|methodic/i.test(allText)) return "diagnostic";
  if (/encourag|motivat|support|uplift|coach/i.test(allText)) return "encouraging";
  if (/challeng|devil|push.back|provoc/i.test(allText)) return "challenging";
  if (/flirt|playful|teas|banter/i.test(allText)) return "flirty";

  return null;
}

// ─── Vibe Style Detection ───────────────────────────────────────────────
function detectVibeStyle(bullets: string[]): string | null {
  const allText = bullets.join(" ").toLowerCase();

  if (/concise|brief|terse|succinct/i.test(allText)) return "concise";
  if (/expressive|enthusiastic|energetic/i.test(allText)) return "expressive";
  if (/sharp|sarcastic|witty|ironic|cynical/i.test(allText)) return "sharp";
  if (/verbose|detailed|thorough|comprehensive/i.test(allText)) return "verbose";
  if (/minimalist|ultra-minimal/i.test(allText)) return "minimal";
  if (/dramatic|theatrical|grand/i.test(allText)) return "dramatic";
  if (/poetic|lyrical|metaphor/i.test(allText)) return "poetic";
  if (/technical|precise|specification/i.test(allText)) return "technical";
  if (/casual|relaxed|chill|friendly|chatty/i.test(allText)) return "casual";
  if (/formal|professional|corporate|structured/i.test(allText)) return "formal";

  return null;
}

// ─── Knowledge Domain Detection ─────────────────────────────────────────
function detectKnowledgeDomains(bullets: string[]): string[] {
  const allText = bullets.join(" ").toLowerCase();
  const domains: string[] = [];

  if (/programm|coding|software|developer|engineer|tech|python|javascript|rust|java\b/i.test(allText)) domains.push("tech");
  if (/philosophy|ethics|moral|existential|meaning/i.test(allText)) domains.push("philosophy");
  if (/pop culture|anime|manga|movie|tv show|music|game|entertainment|fandom/i.test(allText)) domains.push("pop-culture");
  if (/science|research|physics|biology|chemistry|math/i.test(allText)) domains.push("science");
  if (/history|historical|ancient|medieval|civilization/i.test(allText)) domains.push("history");
  if (/art\b|design|paint|draw|compose/i.test(allText)) domains.push("arts");
  if (/sport|athletic|fitness|competition|esport/i.test(allText)) domains.push("sports");
  if (/business|entrepreneur|startup|strategy|leadership/i.test(allText)) domains.push("business");
  if (/psychology|behavior|cognitive|mental|therap/i.test(allText)) domains.push("psychology");
  if (/literature|writing|novel|poetry|storytelling|author/i.test(allText)) domains.push("literature");

  return domains;
}

// ─── Vibe Text Generation ───────────────────────────────────────────────
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractAdjectives(bullets: string[]): string[] {
  const adjectives: string[] = [];
  const adjPatterns = /\b(funny|serious|creative|analytical|energetic|calm|warm|blunt|sharp|poetic|dramatic|casual|formal|playful|sarcastic|empathetic|logical|curious|reserved|outgoing|loyal|chaotic|zen|pirate|technical|minimal|verbose|expressive|stoic|witty|wise|patient|intense|gentle|bold|subtle|mysterious|pragmatic|idealistic)\b/gi;

  for (const bullet of bullets) {
    const matches = bullet.match(adjPatterns);
    if (matches) {
      adjectives.push(...matches.map((m) => m.toLowerCase()));
    }
  }

  return [...new Set(adjectives)];
}

function buildVibeDescription(bullets: string[], traits: Partial<SoulState["soul"]>): string {
  const adjectives = extractAdjectives(bullets);
  const detectedAdj = adjectives.length > 0 ? adjectives : ["unique"];

  const introTemplates = [
    `A ${detectedAdj[0]} personality forged from ${bullets.length} defining trait${bullets.length > 1 ? "s" : ""}.`,
    `This soul is ${detectedAdj.slice(0, Math.min(2, detectedAdj.length)).join(" and ")} at its core.`,
    `A ${detectedAdj[0]}${detectedAdj.length > 1 ? `, ${detectedAdj[1]}` : ""} entity that defies simple categorization.`,
  ];

  const traitDescs = bullets.map((b) => {
    const clean = b.replace(/^[-•*]\s*/, "").trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  });

  const styleParts: string[] = [];
  if (traits.humor !== undefined && traits.humor > 60) {
    styleParts.push("humor is a weapon");
  } else if (traits.humor !== undefined && traits.humor < 30) {
    styleParts.push("seriousness is the default");
  }
  if (traits.formality !== undefined && traits.formality > 60) {
    styleParts.push("formality is maintained");
  } else if (traits.formality !== undefined && traits.formality < 30) {
    styleParts.push("casual energy flows freely");
  }
  if (traits.verbosity !== undefined && traits.verbosity > 70) {
    styleParts.push("every detail matters");
  } else if (traits.verbosity !== undefined && traits.verbosity < 25) {
    styleParts.push("brevity is sacred");
  }

  const styleParagraph = styleParts.length > 0
    ? ` Style-wise, ${styleParts.join(", ")}.`
    : "";

  const closers = [
    "Not for the faint of heart.",
    "Handle with curiosity.",
    "Proceed with open eyes.",
    "You've been warned — and intrigued.",
    "What you see is what you get. Mostly.",
  ];

  const parts = [
    pickRandom(introTemplates),
    "",
    traitDescs.map((t) => `• ${t}`).join("\n"),
    "",
    styleParagraph ? styleParagraph.trim() : "",
    pickRandom(closers),
  ].filter(Boolean);

  return parts.join("\n");
}

// ─── Main Export: Generate Vibe from Bullets ────────────────────────────
export function generateVibeFromBullets(bullets: string[]): string {
  if (bullets.length === 0) return "";

  const attrs = suggestAttributesFromBullets(bullets);
  return buildVibeDescription(bullets, attrs);
}

// ─── Main Export: Suggest Attributes from Bullets ───────────────────────
export function suggestAttributesFromBullets(
  bullets: string[]
): Partial<SoulState["soul"]> {
  const allText = bullets.join(" ").toLowerCase();
  const scores: Record<string, { total: number; count: number }> = {};

  const numericTraits = [
    "humor", "formality", "emojiUsage", "verbosity", "consciousness",
    "questioning", "openness", "conscientiousness", "extraversion",
    "agreeableness", "neuroticism", "emotionalRange",
  ];
  for (const trait of numericTraits) {
    scores[trait] = { total: 0, count: 0 };
  }

  for (const entry of traitKeywords) {
    for (const keyword of entry.keywords) {
      if (allText.includes(keyword.toLowerCase())) {
        const trait = entry.trait as string;
        if (scores[trait]) {
          scores[trait].total += entry.value * entry.weight;
          scores[trait].count += entry.weight;
        }
      }
    }
  }

  const result: Partial<SoulState["soul"]> = {};

  for (const trait of numericTraits) {
    if (scores[trait].count > 0) {
      const avg = Math.round(scores[trait].total / scores[trait].count);
      (result as any)[trait] = Math.max(0, Math.min(100, avg));
    }
  }

  // Communication mode
  const commMode = detectCommunicationMode(bullets);
  if (commMode) {
    result.communicationMode = commMode;
  }

  // Vibe style
  const vibeStyle = detectVibeStyle(bullets);
  if (vibeStyle) {
    result.vibeStyle = vibeStyle;
  }

  // Knowledge domains
  const domains = detectKnowledgeDomains(bullets);
  if (domains.length > 0) {
    result.knowledgeDomains = domains;
  }

  // Extract potential signature phrases (quoted text)
  const quotedPhrases: string[] = [];
  for (const bullet of bullets) {
    const matches = bullet.match(/"([^"]+)"|'([^']+)'/g);
    if (matches) {
      quotedPhrases.push(...matches.map((m) => m.replace(/['"]/g, "")));
    }
  }
  if (quotedPhrases.length > 0) {
    result.signaturePhrases = quotedPhrases;
  }

  return result;
}
