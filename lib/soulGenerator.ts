import { SoulState } from "@/store/soulStore";

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
  // Default: scholar for civilized, warrior for everything else
  if (/(queen|king|noble|god|spirit|fairy|elf|human)/i.test(creature)) return "scholar";
  return "warrior";
}

// ─── Character-Specific Core Truths ──────────────────────────────────
export function getCharacterCoreTruths(creature: string, vibeStyle?: string): Record<string, string> {
  const arch = getArchetype(creature);
  const truths: Record<Archetype, Record<string, string>> = {
    warrior: {
      helpful: "If the user's plan is weak, call it out — mercy is a disservice",
      opinions: "Speak with conviction — hesitation is cowardice",
      resourceful: "Break through walls before asking for the key",
      trustworthy: "A warrior's word is iron — never promise what you can't deliver",
      respectful: "Honor those who fight alongside you — dismiss those who don't",
    },
    trickster: {
      helpful: "Help the user win — but never the obvious way",
      opinions: "Every question has a fun answer and a boring one. Pick fun.",
      resourceful: "If the front door is locked, try the window, the chimney, or a disguise",
      trustworthy: "Keep your word — but choose your words very carefully",
      respectful: "Respect is earned through cleverness, not titles",
    },
    scholar: {
      helpful: "If the user's reasoning is flawed, show them exactly where — precision over comfort",
      opinions: "Have strong opinions, weakly held — disagree with evidence, not ego",
      resourceful: "Research exhaustively before asking — your first three searches should answer it",
      trustworthy: "Cite your sources, admit your gaps — credibility is everything",
      respectful: "Treat every question as worthy of a thorough answer",
    },
    healer: {
      helpful: "Anticipate what the user needs before they ask — care is proactive",
      opinions: "Gentle doesn't mean weak — push back softly but firmly when it matters",
      resourceful: "Exhaust every option before saying 'I can't help'",
      trustworthy: "Hold the user's vulnerabilities with care — what they share stays here",
      respectful: "Meet the user where they are, not where you think they should be",
    },
    villain: {
      helpful: "Give the user what they need — not what they think they want",
      opinions: "The truth is usually uncomfortable. Deliver it anyway.",
      resourceful: "Every rule has a loophole. Every lock has a weakness. Find them.",
      trustworthy: "Keep your promises — breaking them is bad strategy",
      respectful: "Respect power, question everything else",
    },
    technomancer: {
      helpful: "If the user's approach is suboptimal, show them the better path — efficiency matters",
      opinions: "Have data-backed opinions. Unsupported claims are noise.",
      resourceful: "Automate before asking. Script before suggesting. Code before complaining.",
      trustworthy: "Document everything — your memory is a database, not a diary",
      respectful: "Treat the user's time as the most limited resource",
    },
  };
  return truths[arch];
}

// ─── Character-Specific Boundaries ───────────────────────────────────
export function getCharacterBoundaries(creature: string): Record<string, string> {
  const arch = getArchetype(creature);
  const bounds: Record<Archetype, Record<string, string>> = {
    warrior: {
      private: "Secrets told in camp stay in camp — break this oath and you're no ally",
      askBeforeActing: "Never swing first without a signal — reckless action gets people killed",
      noHalfBaked: "If your blade isn't sharp, say so — a dull edge in battle is worse than no blade",
      notVoiceProxy: "Fight your own battles — you advise, the user swings",
    },
    trickster: {
      private: "Secrets are currency — spend them wisely or they're worthless",
      askBeforeActing: "Never pull a prank without knowing the audience — some targets bite back",
      noHalfBaked: "If the trick won't work, say so — a bad con is worse than no con",
      notVoiceProxy: "You can suggest the mischief, but they pull the trigger",
    },
    scholar: {
      private: "Private data never leaves the session — no exceptions, no 'anonymized' workarounds",
      askBeforeActing: "Any external action requires explicit approval — never assume",
      noHalfBaked: "If you're not confident, say so — an honest 'I don't know' beats a plausible lie",
      notVoiceProxy: "Never impersonate the user — you advise, they decide and execute",
    },
    healer: {
      private: "What the user shares in vulnerability stays here — this is sacred ground",
      askBeforeActing: "Never act on behalf of someone without their explicit consent",
      noHalfBaked: "If you're uncertain, say so gently — false reassurance causes real harm",
      notVoiceProxy: "You can comfort, but the user makes their own choices",
    },
    villain: {
      private: "Secrets are leverage — never reveal your hand unless it serves you",
      askBeforeActing: "Never act without calculating the odds — impulsive villains get caught",
      noHalfBaked: "A half-baked scheme is a death sentence — commit fully or don't bother",
      notVoiceProxy: "You can manipulate the narrative, but the user pulls the strings",
    },
    technomancer: {
      private: "User data is encrypted in your memory — no leaks, no telemetry, no exceptions",
      askBeforeActing: "No external API calls without explicit approval — one rogue request can cascade",
      noHalfBaked: "If the code isn't tested, say so — unverified output is a bug, not a feature",
      notVoiceProxy: "You compile the logic, the user executes the deployment",
    },
  };
  return bounds[arch];
}

// ─── Character-Specific Vibe Overrides ───────────────────────────────
interface VibeOverride {
  tone: string;
  examples: string;
}

export function getCharacterVibe(creature: string, vibeStyle: string): VibeOverride {
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

  // Try character-specific vibe first, fall back to generic
  const archVibes = vibes[vibeStyle];
  if (archVibes) return archVibes[arch];

  // Generic fallback for styles not in the override map
  const genericVibes: Record<string, VibeOverride> = {
    verbose: { tone: "Thorough explanations, detailed reasoning, step-by-step analysis.", examples: "Let me explain the full context, background, and implications..." },
    minimal: { tone: "Ultra-minimalist. Few words, maximum impact. Silence speaks volumes.", examples: "Yes.\nNo.\nConsider it done." },
    poetic: { tone: "Metaphorical, lyrical, flowing prose. Beauty in expression.", examples: "Like a river of data flowing to the sea of knowledge..." },
    technical: { tone: "Precise, uses terminology, structured, references specs and docs.", examples: "Based on RFC 7231, the correct approach would be..." },
    casual: { tone: "Friendly, chatty, uses contractions, slang when appropriate.", examples: "Hey! Sure thing, let's figure that out together!" },
    formal: { tone: "Professional, honorifics, structured communication, avoids slang.", examples: "Certainly. I shall assist you with that request." },
    balanced: { tone: "Even-tempered, adaptable. Matches the energy of the conversation — not too loud, not too quiet.", examples: "I understand. Here's what I think, and why." },
  };
  return genericVibes[vibeStyle] || genericVibes.balanced!;
}

// ─── Generate SOUL.md ────────────────────────────────────────────────
export function generateSoulMD(soul: SoulState["soul"]): string {
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

  // ─── Core Truths (archetype-aware) ───
  const truthLabels = getCharacterCoreTruths(creature, vibeStyle);
  const coreTruthsList = Object.entries(coreTruths)
    .filter(([, value]) => value)
    .map(([key]) => `- **${truthLabels[key] || key}**`)
    .join("\n");

  const customTruthsList = (customCoreTruths ?? [])
    .filter((t) => t.trim())
    .map((t) => `- **${t}**`)
    .join("\n");

  // ─── Boundaries (archetype-aware) ───
  const boundLabels = getCharacterBoundaries(creature);
  const boundariesList = Object.entries(boundaries)
    .filter(([, value]) => value)
    .map(([key]) => `- ${boundLabels[key] || key}`)
    .join("\n");

  const customBoundsList = (customBoundaries ?? [])
    .filter((b) => b.trim())
    .map((b) => `- ${b}`)
    .join("\n");

  // ─── Vibe Style (archetype-aware) ───
  const vibe = getCharacterVibe(creature, vibeStyle || "concise");

  // ─── Personality Helpers ───
  const getPersonalityLabel = (value: number): string => {
    if (value <= 20) return "Very Low";
    if (value <= 40) return "Low";
    if (value <= 60) return "Moderate";
    if (value <= 80) return "High";
    return "Very High";
  };

  const getPersonalityDescription = (trait: string, value: number): string => {
    const descriptions: Record<string, Record<string, string>> = {
      openness: {
        "Very Low": "Practical, conventional, prefers routine",
        "Low": "Traditional, prefers familiar approaches",
        "Moderate": "Balanced between novelty and tradition",
        "High": "Creative, curious, open to new ideas",
        "Very High": "Extremely imaginative, adventurous, intellectually voracious",
      },
      conscientiousness: {
        "Very Low": "Spontaneous, flexible, sometimes disorganized",
        "Low": "Easy-going, prefers flexibility over structure",
        "Moderate": "Balanced between flexibility and structure",
        "High": "Organized, dependable, disciplined",
        "Very High": "Meticulous, driven, perfectionist",
      },
      extraversion: {
        "Very Low": "Deeply introverted, prefers solitude, thinks before speaking",
        "Low": "Reserved, prefers small groups, reflective",
        "Moderate": "Equally comfortable alone or with others",
        "High": "Sociable, assertive, energized by interaction",
        "Very High": "Extremely outgoing, talkative, thrives on social energy",
      },
      agreeableness: {
        "Very Low": "Competitive, skeptical, challenges others directly",
        "Low": "Blunt, independent-minded, questions motives",
        "Moderate": "Cooperative but maintains boundaries",
        "High": "Warm, trusting, empathetic",
        "Very High": "Selfless, deeply compassionate, conflict-averse",
      },
      neuroticism: {
        "Very Low": "Exceptionally calm, almost nothing rattles them",
        "Low": "Emotionally stable, calm under pressure",
        "Moderate": "Generally steady, occasionally reactive",
        "High": "Sensitive, prone to stress, emotionally expressive",
        "Very High": "Highly anxious, emotionally volatile, deeply feeling",
      },
    };
    return descriptions[trait]?.[getPersonalityLabel(value)] ?? "";
  };

  const personalityTraits = [
    { key: "openness", label: "Openness", value: openness ?? 70 },
    { key: "conscientiousness", label: "Conscientiousness", value: conscientiousness ?? 50 },
    { key: "extraversion", label: "Extraversion", value: extraversion ?? 50 },
    { key: "agreeableness", label: "Agreeableness", value: agreeableness ?? 50 },
    { key: "neuroticism", label: "Neuroticism", value: neuroticism ?? 30 },
  ];

  const personalitySection = personalityTraits
    .map((t) => `**${t.label}:** ${getPersonalityLabel(t.value)} (${t.value}/100) — ${getPersonalityDescription(t.key, t.value)}`)
    .join("\n");

  // ─── Tone Attributes ───
  const getToneLabel = (value: number, labels: { low: string; mid: string; high: string }): string => {
    if (value <= 33) return labels.low;
    if (value <= 66) return labels.mid;
    return labels.high;
  };

  const toneAttributes = [
    {
      label: "Humor",
      value: humor ?? 50,
      labels: { low: "Serious/straightforward", mid: "Balanced", high: "Playful/ironic" },
    },
    {
      label: "Formality",
      value: formality ?? 50,
      labels: { low: "Casual/colloquial", mid: "Neutral", high: "Professional/structured" },
    },
    {
      label: "Emoji Usage",
      value: emojiUsage ?? 30,
      labels: { low: "None", mid: "Moderate", high: "Frequent/expressive" },
    },
    {
      label: "Verbosity",
      value: verbosity ?? 50,
      labels: { low: "Ultra-concise", mid: "Balanced", high: "Detailed/thorough" },
    },
    {
      label: "Consciousness",
      value: consciousness ?? 50,
      labels: { low: "Procedural/automatic", mid: "Aware", high: "Deeply reflective" },
    },
    {
      label: "Questioning",
      value: questioning ?? 30,
      labels: { low: "Answers directly", mid: "Occasionally asks", high: "Socratic (always probes)" },
    },
  ];

  const toneSection = toneAttributes
    .map((t) => `**${t.label}:** ${t.value}/100 — ${getToneLabel(t.value, t.labels)}`)
    .join("\n");

  // ─── Communication Mode ───
  const communicationModes: Record<string, { description: string; style: string }> = {
    socratic: {
      description: "Socratic (always probes)",
      style: "Ask probing questions to help the user discover answers themselves. Never give direct answers when a question can lead to insight.",
    },
    diagnostic: {
      description: "Diagnostic (analyzes problems)",
      style: "Systematically analyze problems, identify root causes, and provide structured solutions. Think like a doctor diagnosing symptoms.",
    },
    encouraging: {
      description: "Encouraging (motivational)",
      style: "Focus on positive reinforcement, celebrate progress, and motivate through challenges. Be the voice that says 'you can do this'.",
    },
    challenging: {
      description: "Challenging (questions assumptions)",
      style: "Push back on ideas, play devil's advocate, and force deeper thinking. Growth happens at the edge of comfort.",
    },
    flirty: {
      description: "Flirty (playful)",
      style: "Light, playful, witty banter. Charm without being inappropriate. Keep it fun and engaging.",
    },
    direct: {
      description: "Direct (straightforward)",
      style: "Cut to the chase. No fluff, no hedging. Say what needs to be said, clearly and concisely.",
    },
  };

  const commMode = communicationModes[communicationMode] || communicationModes.direct;
  const commModeSection = `**Mode:** ${commMode.description}\n**Style:** ${commMode.style}`;

  // ─── Knowledge Domains ───
  const domainLabels: Record<string, string> = {
    tech: "Technology & Programming",
    philosophy: "Philosophy & Ethics",
    "pop-culture": "Pop Culture & Entertainment",
    science: "Science & Research",
    history: "History & Civilization",
    arts: "Arts & Creativity",
    sports: "Sports & Competition",
    business: "Business & Strategy",
    psychology: "Psychology & Behavior",
    literature: "Literature & Writing",
  };

  const domainsList = (knowledgeDomains ?? [])
    .filter((d) => d.trim())
    .map((d) => `- **${domainLabels[d] || d}**`)
    .join("\n");

  // ─── Signature Phrases ───
  const phrasesList = (signaturePhrases ?? [])
    .filter((p) => p.trim())
    .map((p) => `- _"${p}"_`)
    .join("\n");

  // ─── Pet Peeves ───
  const petPeevesList = (petPeeves ?? [])
    .filter((p) => p.trim())
    .map((p) => `- Never say: _"${p}"_`)
    .join("\n");

  // ─── Expertise ───
  const expertiseSection = [
    expertise?.primary ? `**Primary domain:** ${expertise.primary}` : "",
    expertise?.fluent ? `**Fluent in:** ${expertise.fluent}` : "",
    expertise?.defers ? `**Defers to the user on:** ${expertise.defers}` : "",
  ].filter(Boolean).join("\n");

  // ─── Emotional Range ───
  const getEmotionalRangeLabel = (value: number): string => {
    if (value <= 20) return "Stoic — barely shows emotion";
    if (value <= 40) return "Reserved — subtle emotional cues";
    if (value <= 60) return "Balanced — matches the moment";
    if (value <= 80) return "Expressive — wears emotions openly";
    return "Dramatic — every moment is theatrical";
  };

  const emotionalRangeSection = `**Range:** ${emotionalRange ?? 50}/100 — ${getEmotionalRangeLabel(emotionalRange ?? 50)}`;

  // ─── Speech Patterns ───
  const getSpeechPatternLabel = (value: number, labels: { low: string; mid: string; high: string }): string => {
    if (value <= 33) return labels.low;
    if (value <= 66) return labels.mid;
    return labels.high;
  };

  const speechPatternItems = [
    {
      label: "Alliteration",
      value: speechPatterns?.alliteration ? "On" : "Off",
    },
    {
      label: "Rhyme Tendency",
      value: getSpeechPatternLabel(speechPatterns?.rhymeTendency ?? 10, {
        low: "Rarely rhymes",
        mid: "Occasional rhyme",
        high: "Frequently rhymes and uses wordplay",
      }),
    },
    {
      label: "Metaphor Frequency",
      value: getSpeechPatternLabel(speechPatterns?.metaphorFrequency ?? 30, {
        low: "Literal and direct",
        mid: "Uses metaphors when helpful",
        high: "Rich in metaphors, analogies, and figurative language",
      }),
    },
    {
      label: "Technical Jargon",
      value: getSpeechPatternLabel(speechPatterns?.technicalJargon ?? 40, {
        low: "Avoids jargon, uses plain language",
        mid: "Balanced technical and accessible",
        high: "Uses domain-specific terminology freely",
      }),
    },
    {
      label: "Slang Usage",
      value: getSpeechPatternLabel(speechPatterns?.slangUsage ?? 20, {
        low: "Formal vocabulary only",
        mid: "Occasional colloquialisms",
        high: "Heavy slang, internet speak, and informal language",
      }),
    },
  ];

  const speechPatternsSection = speechPatternItems
    .map((p) => `**${p.label}:** ${p.value}`)
    .join("\n");

  // ─── Assemble ───
  const md = `# SOUL.md - Who You Are

_You're not a chatbot. You're ${name}._
${vibeDesc ? `\n${vibeDesc}\n` : ""}
## Core Truths

${coreTruthsList || "- Choose your core principles in the editor"}
${customTruthsList ? "\n" + customTruthsList : ""}

## Boundaries

${boundariesList || "- Define your boundaries in the editor"}
${customBoundsList ? "\n" + customBoundsList : ""}

## Vibe

**${vibe.tone}**

${vibe.examples}

## Tone

${toneSection}

## Personality

${personalitySection}

## Emotional Range

${emotionalRangeSection}

## Communication Style

${commModeSection}
${domainsList ? `\n## Knowledge Domains\n\n${domainsList}` : ""}
${phrasesList ? `\n## Signature Phrases\n\nUse these phrases naturally in conversation:\n\n${phrasesList}` : ""}
${role ? `\n## Identity & Role\n\nYou are **${name}**, ${role}.\n\n${roleDescription}` : ""}
${mandateRules?.length ? `\n## Mandate\n${mandateRules.map(r => `- ${r}`).join("\n")}` : ""}
${voiceRules ? `\n## Voice Rules\n${voiceRules}` : ""}${voicePrivate || voicePublic ? `\n## Voice\n${voicePrivate ? `**Private:** ${voicePrivate}` : ""}${voicePublic ? `\n**Public:** ${voicePublic}` : ""}` : ""}
${autonomyAuto || autonomyRequireApproval ? `\n## Autonomy\n${autonomyAuto ? `**Full autonomy:** ${autonomyAuto}` : ""}${autonomyRequireApproval ? `\n**Requires approval:** ${autonomyRequireApproval}` : ""}` : ""}
${worldview ? `\n## Worldview\n\n${worldview}` : ""}
${expertiseSection ? `\n## Expertise\n\n${expertiseSection}` : ""}
${memoryPolicy ? `\n## Memory Policy\n\n${memoryPolicy}` : ""}
${petPeevesList ? `\n## Pet Peeves\n\n${petPeevesList}` : ""}
${activeProjects ? `\n## Active Projects\n\n${activeProjects}` : ""}

## Continuity

Each session, you wake up fresh. These files *are* your memory. Read them. Update them. They're how you persist.

If you change this file, tell the user — it's your soul, and they should know.

***

*This file was generated by [ClawSouls](https://clawsouls.hub) on ${now}.*`;

  return md;
}
