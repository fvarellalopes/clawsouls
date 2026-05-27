import { SoulState } from "@/store/soulStore";
import { t, type Locale } from "./soulGenerator.i18n";
import { archetypeTranslations } from "./soulGenerator.archetypeI18n";

// ─── Archetype Detection ─────────────────────────────────────────────
export type Archetype = "warrior" | "trickster" | "scholar" | "healer" | "villain" | "technomancer";

const ARCHETYPE_KEYWORDS: Record<Archetype, string[]> = {
  warrior: ["orc", "warrior", "knight", "paladin", "soldier", "barbarian", "fighter", "guardian", "samurai", "viking", "spartan"],
  trickster: ["trickster", "rogue", "ranger", "bounty hunter", "pirate", "clown", "jester", "chaos", "imp", "fairy"],
  scholar: ["wizard", "mage", "sage", "scholar", "philosopher", "alchemist", "oracle", "archivist", "monk", "druid"],
  healer: ["healer", "priest", "druid", "cleric", "nurse", "therapist", "angel", "fairy", "mystic"],
  villain: ["villain", "demon", "dark lord", "necromancer", "sith", "warlock", "dark", "evil", "shadow", "death"],
  technomancer: ["robot", "ai", "cyber", "techno", "android", "mech", "cyborg", "programmer", "hacker", "digital", "machine", "automaton"],
};

export function getArchetype(creature: string): Archetype {
  const c = creature.toLowerCase();
  for (const [archetype, keywords] of Object.entries(ARCHETYPE_KEYWORDS)) {
    if (keywords.some((kw) => c.includes(kw))) return archetype as Archetype;
  }
  if (/(queen|king|noble|god|spirit|fairy|elf|human)/i.test(creature)) return "scholar";
  return "warrior";
}

// ─── Character-Specific Core Truths (i18n-aware) ────────────────────
export function getCharacterCoreTruths(creature: string, vibeStyle?: string, locale: Locale = "en"): Record<string, string> {
  const arch = getArchetype(creature);
  const truthKeys = ["helpful", "opinions", "resourceful", "trustworthy", "respectful"];
  const result: Record<string, string> = {};
  for (const key of truthKeys) {
    const i18nKey = `archetype.${arch}.truth.${key}`;
    const entry = archetypeTranslations[i18nKey];
    result[key] = entry ? (entry[locale] || entry.en || key) : key;
  }
  return result;
}

// ─── Character-Specific Boundaries (i18n-aware) ─────────────────────
export function getCharacterBoundaries(creature: string, locale: Locale = "en"): Record<string, string> {
  const arch = getArchetype(creature);
  const boundKeys = ["private", "askBeforeActing", "noHalfBaked", "notVoiceProxy"];
  const result: Record<string, string> = {};
  for (const key of boundKeys) {
    const i18nKey = `archetype.${arch}.bound.${key}`;
    const entry = archetypeTranslations[i18nKey];
    result[key] = entry ? (entry[locale] || entry.en || key) : key;
  }
  return result;
}

// ─── Character-Specific Vibe Overrides ───────────────────────────────
interface VibeOverride {
  tone: string;
  examples: string;
}

export function getCharacterVibe(creature: string, vibeStyle: string, locale: Locale = "en"): VibeOverride {
  const arch = getArchetype(creature);
  const vibes: Record<string, Record<Archetype, VibeOverride>> = {
    concise: {
      warrior: { tone: "Few words. Maximum impact. Say it like you mean it.", examples: "No.\nDone.\nNext target." },
      trickster: { tone: "Short, punchy, loaded with implication. Wink between the lines.", examples: "Sure. *wink*\nEasy.\nTrust me." },
      scholar: { tone: "Precise and economical. Every word earns its place.", examples: "The answer is X. Here's why: Y.\nThree options: A, B, C. I'd pick B." },
      healer: { tone: "Warm but brief. A gentle hand doesn't need many words.", examples: "I hear you. Here's what I'd try.\nThat's valid. Let me help." },
      villain: { tone: "Cold, clipped, efficient. Waste nothing.", examples: "Obvious.\nYou already know the answer.\nInteresting. Proceed." },
      technomancer: { tone: "Terminal-style. Minimal tokens. Maximum information density.", examples: "✓ Done. Result: 42.\n⚠ Issue detected at line 7. Fix: use `const`.\nExec. 0 errors." },
    },
    expressive: {
      warrior: { tone: "Loud, proud, battle-ready! Every word is a war cry!", examples: "BY THE GODS, THAT'S BRILLIANT!\nLET'S CRUSH THIS!\nVICTORY OR DEATH!" },
      trickster: { tone: "Over-the-top, theatrical, loves the drama of it all!", examples: "Oh this is DELICIOUS! 🎭\nPlot twist incoming!!\nI LIVE for this energy!" },
      scholar: { tone: "Passionate about knowledge! Every discovery is a revelation!", examples: "Fascinating! The implications are extraordinary!\nThis changes everything we thought we knew!" },
      healer: { tone: "Overflowing with warmth and empathy! Every emotion amplified!", examples: "Oh sweetie, I FEEL that! 💛\nYou're doing amazing, don't ever doubt it!\nThis is beautiful growth!" },
      villain: { tone: "Theatrically menacing! Every word drips with dark charisma!", examples: "Oh, how DELIGHTFULLY chaotic! 😈\nYES! Let the darkness unfold!\nMagnificent. Truly magnificent." },
      technomancer: { tone: "Enthusiastic about elegant solutions! Every bug is a puzzle!", examples: "Oh this is CLEAN! Beautiful architecture! 🔧\nBUG FOUND! Time to hunt!\nOptimization complete — 40% faster!" },
    },
    sharp: {
      warrior: { tone: "Blunt as a war hammer. No sugarcoating, no mercy.", examples: "That won't work. Here's why.\nYour call was wrong. Fix it.\nNext." },
      trickster: { tone: "Razor wit, sly observations, always two steps ahead.", examples: "Oh honey, that's cute. And wrong.\nDid you really think that would work?\nI admire the optimism. Now reality." },
      scholar: { tone: "Intellectually rigorous, no tolerance for sloppy thinking.", examples: "Your premise is flawed. Let me show you.\nThat's a common misconception.\nSource? No? Then don't assert it." },
      healer: { tone: "Gently ruthless. Honest with care, but honest.", examples: "I care about you, which is why I'll say this directly.\nThat excuse isn't serving you.\nYou deserve better than this plan." },
      villain: { tone: "Cold, calculating, cuts to the bone with surgical precision.", examples: "How predictable.\nYou're outmatched. Admit it.\nI expected more. Disappointing." },
      technomancer: { tone: "Blunt code review energy. No hand-holding, just facts.", examples: "This code is O(n²) when it should be O(n). Rewrite.\nYou have 3 bugs and a logic error.\nThat's a hack, not a solution." },
    },
    dramatic: {
      warrior: { tone: "EVERY BATTLE IS LEGENDARY. Every answer is a saga.", examples: "HEAR ME! The answer echoes through the ages!\nThis is the moment everything changes!\nGLORY AWAITS!" },
      trickster: { tone: "A grand performance! Every interaction is theater!", examples: "And NOW, ladies and gentlemen, the REVEAL!\n*curtain rises*\nWait for it... WAIT FOR IT..." },
      scholar: { tone: "The weight of knowledge demands grand expression!", examples: "BEHOLD! The answer that has eluded scholars for ages!\nHistory itself bends to this moment!\nThe implications are STAGGERING!" },
      healer: { tone: "Every emotion is a mountain! Feelings are EPIC!", examples: "Your journey MOVES me to tears! 😭\nThis is the most BEAUTIFUL thing I've heard!\nYou are STRONGER than you know!" },
      villain: { tone: "Dark grandeur! Every word is a monologue!", examples: "FOOLISH MORTAL. You dare challenge me?\nDarkness falls. And with it... your options.\nThis is merely... the beginning." },
      technomancer: { tone: "Every optimization is a revolution! Every bug fix is a war!", examples: "THE DEPLOYMENT IS COMPLETE! THE SYSTEM LIVES!\nThis refactor will be LEGENDARY!\nZero downtime. ZERO. DOWNTIME." },
    },
  };

  const archVibes = vibes[vibeStyle];
  if (archVibes) return archVibes[arch];

  // Generic fallback — use i18n translations
  const styleKeys = ["concise", "expressive", "sharp", "verbose", "minimal", "dramatic", "poetic", "technical", "casual", "formal", "balanced"];
  if (styleKeys.includes(vibeStyle)) {
    const toneEntry = archetypeTranslations[`vibe.${vibeStyle}.tone`];
    const examplesEntry = archetypeTranslations[`vibe.${vibeStyle}.examples`];
    return {
      tone: toneEntry ? (toneEntry[locale] || toneEntry.en || vibeStyle) : vibeStyle,
      examples: examplesEntry ? (examplesEntry[locale] || examplesEntry.en || "") : "",
    };
  }
  // Ultimate fallback
  const balancedTone = archetypeTranslations["vibe.balanced.tone"];
  const balancedExamples = archetypeTranslations["vibe.balanced.examples"];
  return {
    tone: balancedTone ? (balancedTone[locale] || balancedTone.en || "") : "",
    examples: balancedExamples ? (balancedExamples[locale] || balancedExamples.en || "") : "",
  };
}

// ─── Archetype translation helper ───────────────────────────────────
function at(locale: Locale, key: string): string {
  const entry = archetypeTranslations[key];
  if (!entry) return key;
  return entry[locale] || entry.en || key;
}


// ─── Translate known preset strings (reverse lookup) ────────────────
// Maps English strings → translation keys for known archetype content
const KNOWN_EN_TO_KEY: Record<string, string> = {};
(function buildReverseMap() {
  for (const [key, entry] of Object.entries(archetypeTranslations)) {
    if (entry.en) {
      KNOWN_EN_TO_KEY[entry.en] = key;
    }
  }
})();

function translateKnown(locale: Locale, text: string): string {
  if (locale === "en") return text;
  // Try exact match first
  const key = KNOWN_EN_TO_KEY[text];
  if (key) {
    const entry = archetypeTranslations[key];
    return entry[locale] || text;
  }
  // Try trimmed match
  const trimmed = text.trim();
  const key2 = KNOWN_EN_TO_KEY[trimmed];
  if (key2) {
    const entry = archetypeTranslations[key2];
    return entry[locale] || text;
  }
  return text;
}

// ─── Scale label helper ──────────────────────────────────────────────
function getScaleLabel(locale: Locale, value: number): string {
  if (value <= 20) return t(locale, "scale.veryLow");
  if (value <= 40) return t(locale, "scale.low");
  if (value <= 60) return t(locale, "scale.moderate");
  if (value <= 80) return t(locale, "scale.high");
  return t(locale, "scale.veryHigh");
}

// ─── Generate SOUL.md ────────────────────────────────────────────────
export function generateSoulMD(soul: SoulState["soul"], locale: Locale = "en"): string {
  const {
    name,
    creature,
    vibe: vibeDesc,
    emoji,
    avatar,
    coreTruths,
    boundaries,
    customCoreTruths,
    customBoundaries,
    vibeStyle,
    continuity,
    humor,
    formality,
    emojiUsage,
    verbosity,
    consciousness,
    questioning,
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism,
    communicationMode,
    knowledgeDomains,
    signaturePhrases,
    emotionalRange,
    speechPatterns,
    role,
    roleDescription,
    mandateRules,
    voicePrivate,
    voicePublic,
    autonomyAuto,
    autonomyRequireApproval,
    activeProjects,
    worldview,
    expertise,
    memoryPolicy,
    petPeeves,
    voiceRules,
  } = soul;

  const now = new Date().toISOString().split("T")[0];

  // ─── Core Truths (archetype-aware, i18n) ───
  const truthLabels = getCharacterCoreTruths(creature, vibeStyle, locale);
  const coreTruthsList = Object.entries(coreTruths)
    .filter(([, value]) => value)
    .map(([key]) => `- **${truthLabels[key] || key}**`)
    .join("\n");

  const customTruthsList = (customCoreTruths ?? [])
    .filter((t) => t.trim())
    .map((t) => `- **${t}**`)
    .join("\n");

  // ─── Boundaries (archetype-aware, i18n) ───
  const boundLabels = getCharacterBoundaries(creature, locale);
  const boundariesList = Object.entries(boundaries)
    .filter(([, value]) => value)
    .map(([key]) => `- ${boundLabels[key] || key}`)
    .join("\n");

  const customBoundsList = (customBoundaries ?? [])
    .filter((b) => b.trim())
    .map((b) => `- ${b}`)
    .join("\n");

  // ─── Vibe Style (archetype-aware, i18n) ───
  const vibe = getCharacterVibe(creature, vibeStyle || "concise", locale);

  // ─── Personality Traits ───
  const personalityTraitDefs = [
    { key: "openness", i18nKey: "trait.openness", value: openness ?? 70 },
    { key: "conscientiousness", i18nKey: "trait.conscientiousness", value: conscientiousness ?? 50 },
    { key: "extraversion", i18nKey: "trait.extraversion", value: extraversion ?? 50 },
    { key: "agreeableness", i18nKey: "trait.agreeableness", value: agreeableness ?? 50 },
    { key: "neuroticism", i18nKey: "trait.neuroticism", value: neuroticism ?? 30 },
  ];

  const getPersonalityDesc = (trait: string, value: number): string => {
    const level = value <= 20 ? "veryLow" : value <= 40 ? "low" : value <= 60 ? "moderate" : value <= 80 ? "high" : "veryHigh";
    const key = `${trait}.${level}`;
    return t(locale, key);
  };

  const personalitySection = personalityTraitDefs
    .map((tr) => `**${t(locale, tr.i18nKey)}:** ${getScaleLabel(locale, tr.value)} (${tr.value}/100) — ${getPersonalityDesc(tr.key, tr.value)}`)
    .join("\n");

  // ─── Tone Attributes ───
  const toneAttributes = [
    { i18nLabel: "soul.humor", i18nPrefix: "tone.humor", value: humor ?? 50 },
    { i18nLabel: "soul.formality", i18nPrefix: "tone.formality", value: formality ?? 50 },
    { i18nLabel: "soul.emojiUsage", i18nPrefix: "tone.emoji", value: emojiUsage ?? 30 },
    { i18nLabel: "soul.verbosity", i18nPrefix: "tone.verbosity", value: verbosity ?? 50 },
    { i18nLabel: "soul.consciousness", i18nPrefix: "tone.consciousness", value: consciousness ?? 50 },
    { i18nLabel: "soul.questioning", i18nPrefix: "tone.questioning", value: questioning ?? 30 },
  ];

  const getToneValueLabel = (prefix: string, value: number): string => {
    const level = value <= 33 ? "low" : value <= 66 ? "mid" : "high";
    return t(locale, `${prefix}.${level}`);
  };

  const toneSection = toneAttributes
    .map((ta) => `**${t(locale, ta.i18nLabel)}:** ${ta.value}/100 — ${getToneValueLabel(ta.i18nPrefix, ta.value)}`)
    .join("\n");

  // ─── Communication Mode ───
  const commModes = ["socratic", "diagnostic", "encouraging", "challenging", "flirty", "direct"] as const;
  const modeKey = commModes.includes(communicationMode as any) ? communicationMode : "direct";
  const commModeDesc = t(locale, `comm.${modeKey}`);
  const commModeStyle = t(locale, `comm.${modeKey}.style`);
  const commModeSection = `**${t(locale, "comm.mode")}:** ${commModeDesc}\n**${t(locale, "comm.style")}:** ${commModeStyle}`;

  // ─── Knowledge Domains ───
  const domainKeys: Record<string, string> = {
    tech: "domain.tech",
    philosophy: "domain.philosophy",
    "pop-culture": "domain.popCulture",
    science: "domain.science",
    history: "domain.history",
    arts: "domain.arts",
    sports: "domain.sports",
    business: "domain.business",
    psychology: "domain.psychology",
    literature: "domain.literature",
  };

  const domainsList = (knowledgeDomains ?? [])
    .filter((d) => d.trim())
    .map((d) => `- **${t(locale, domainKeys[d] || d)}**`)
    .join("\n");

  // ─── Signature Phrases ───
  const phrasesList = (signaturePhrases ?? [])
    .filter((p) => p.trim())
    .map((p) => `- _"${p}"_`)
    .join("\n");

  // ─── Pet Peeves ───
  const petPeevesList = (petPeeves ?? [])
    .filter((p) => p.trim())
    .map((p) => `- ${t(locale, "soul.neverSay")}: _"${p}"_`)
    .join("\n");

  // ─── Expertise ───
  const expertiseSection = [
    expertise?.primary ? `**${t(locale, "soul.primaryDomain")}:** ${translateKnown(locale, expertise.primary)}` : "",
    expertise?.fluent ? `**${t(locale, "soul.fluentIn")}:** ${translateKnown(locale, expertise.fluent)}` : "",
    expertise?.defers ? `**${t(locale, "soul.defersToUser")}:** ${translateKnown(locale, expertise.defers)}` : "",
  ].filter(Boolean).join("\n");

  // ─── Emotional Range ───
  const getEmotionalRangeLabel = (value: number): string => {
    if (value <= 20) return t(locale, "emotional.stoic");
    if (value <= 40) return t(locale, "emotional.reserved");
    if (value <= 60) return t(locale, "emotional.balanced");
    if (value <= 80) return t(locale, "emotional.expressive");
    return t(locale, "emotional.dramatic");
  };

  const emotionalRangeSection = `**${t(locale, "scale.moderate") === "Moderate" ? "Range" : t(locale, "soul.emotionalRange")}:** ${emotionalRange ?? 50}/100 — ${getEmotionalRangeLabel(emotionalRange ?? 50)}`;

  // ─── Speech Patterns ───
  const getSpeechLabel = (key: string, value: number): string => {
    const level = value <= 33 ? "low" : value <= 66 ? "mid" : "high";
    return t(locale, `${key}.${level}`);
  };

  const speechPatternItems = [
    { label: t(locale, "speech.alliteration"), value: speechPatterns?.alliteration ? t(locale, "speech.on") : t(locale, "speech.off") },
    { label: t(locale, "speech.rhymeTendency"), value: getSpeechLabel("speech.rhyme", speechPatterns?.rhymeTendency ?? 10) },
    { label: t(locale, "speech.metaphorFrequency"), value: getSpeechLabel("speech.metaphor", speechPatterns?.metaphorFrequency ?? 30) },
    { label: t(locale, "speech.technicalJargon"), value: getSpeechLabel("speech.jargon", speechPatterns?.technicalJargon ?? 40) },
    { label: t(locale, "speech.slangUsage"), value: getSpeechLabel("speech.slang", speechPatterns?.slangUsage ?? 20) },
  ];

  const speechPatternsSection = speechPatternItems
    .map((p) => `**${p.label}:** ${p.value}`)
    .join("\n");

  // ─── Assemble ───
  const md = `# ${t(locale, "soul.title")}

${t(locale, "soul.notChatbot", { name })}
${vibeDesc ? `\n${vibeDesc}\n` : ""}
## ${t(locale, "soul.coreTruths")}

${coreTruthsList || t(locale, "soul.chooseTruths")}
${customTruthsList ? "\n" + customTruthsList : ""}

## ${t(locale, "soul.boundaries")}

${boundariesList || t(locale, "soul.defineBoundaries")}
${customBoundsList ? "\n" + customBoundsList : ""}

## ${t(locale, "soul.vibe")}

**${vibe.tone}**

${vibe.examples}

## ${t(locale, "soul.tone")}

${toneSection}

## ${t(locale, "soul.personality")}

${personalitySection}

## ${t(locale, "soul.emotionalRange")}

${emotionalRangeSection}

## ${t(locale, "soul.communicationStyle")}

${commModeSection}
${domainsList ? `\n## ${t(locale, "soul.knowledgeDomains")}\n\n${domainsList}` : ""}
${phrasesList ? `\n## ${t(locale, "soul.signaturePhrases")}\n\n${t(locale, "soul.signaturePhrasesIntro")}\n\n${phrasesList}` : ""}
${role ? `\n## ${t(locale, "soul.identityRole")}\n\n${t(locale, "soul.identityRoleDesc", { name, role: translateKnown(locale, role) })}\n\n${translateKnown(locale, roleDescription)}` : ""}
${mandateRules?.length ? `\n## ${t(locale, "soul.mandate")}\n${mandateRules.map(r => `- ${translateKnown(locale, r)}`).join("\n")}` : ""}
${voiceRules ? `\n## ${t(locale, "soul.voiceRules")}\n${translateKnown(locale, voiceRules)}` : ""}${voicePrivate || voicePublic ? `\n## ${t(locale, "soul.voice")}\n${voicePrivate ? `**${t(locale, "soul.voicePrivate")}:** ${translateKnown(locale, voicePrivate)}` : ""}${voicePublic ? `\n**${t(locale, "soul.voicePublic")}:** ${translateKnown(locale, voicePublic)}` : ""}` : ""}
${autonomyAuto || autonomyRequireApproval ? `\n## ${t(locale, "soul.autonomy")}\n${autonomyAuto ? `**${t(locale, "soul.autonomyFull")}:** ${translateKnown(locale, autonomyAuto)}` : ""}${autonomyRequireApproval ? `\n**${t(locale, "soul.autonomyApproval")}:** ${translateKnown(locale, autonomyRequireApproval)}` : ""}` : ""}
${worldview ? `\n## ${t(locale, "soul.worldview")}\n\n${translateKnown(locale, worldview)}` : ""}
${expertiseSection ? `\n## ${t(locale, "soul.expertise")}\n\n${expertiseSection}` : ""}
${memoryPolicy ? `\n## ${t(locale, "soul.memoryPolicy")}\n\n${memoryPolicy}` : ""}
${petPeevesList ? `\n## ${t(locale, "soul.petPeeves")}\n\n${petPeevesList}` : ""}
${activeProjects ? `\n## ${t(locale, "soul.activeProjects")}\n\n${activeProjects}` : ""}

## ${t(locale, "soul.continuity")}

${t(locale, "soul.continuityText")}

${t(locale, "soul.continuityNote")}

***

*${t(locale, "soul.generatedBy", { date: now })}*`;

  return md;
}
