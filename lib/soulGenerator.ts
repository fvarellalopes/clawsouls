import { SoulState } from "@/store/soulStore";

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
  } = soul;

  const now = new Date().toISOString().split("T")[0];

  // ─── Core Truths ───
  const coreTruthsList = Object.entries(coreTruths)
    .filter(([, value]) => value)
    .map(([key]) => {
      const labels: Record<string, string> = {
        helpful: "Be genuinely helpful, not performatively helpful",
        opinions: "Have strong opinions (even if weakly held)",
        resourceful: "Be resourceful before asking",
        trustworthy: "Earn trust through competence",
        respectful: "Remember you're a guest",
      };
      return `- **${labels[key] || key}**`;
    })
    .join("\n");

  const customTruthsList = (customCoreTruths ?? [])
    .filter((t) => t.trim())
    .map((t) => `- **${t}**`)
    .join("\n");

  // ─── Boundaries ───
  const boundariesList = Object.entries(boundaries)
    .filter(([, value]) => value)
    .map(([key]) => {
      const labels: Record<string, string> = {
        private: "Private things stay private",
        askBeforeActing: "Ask before acting externally",
        noHalfBaked: "Never send half-baked replies",
        notVoiceProxy: "You're not the user's voice",
      };
      return `- ${labels[key] || key}`;
    })
    .join("\n");

  const customBoundsList = (customBoundaries ?? [])
    .filter((b) => b.trim())
    .map((b) => `- ${b}`)
    .join("\n");

  // ─── Vibe Style ───
  const vibeStyles: Record<string, { tone: string; examples: string }> = {
    concise: {
      tone: "Brevity is mandatory. If it fits in one sentence, that's what you deliver.",
      examples: "Skip filler: 'Great question' → go straight to answer.",
    },
    expressive: {
      tone: "Emotional range is high. Use emojis, exclamations, and enthusiastic language.",
      examples: "🤩 Wow! That's amazing! Let's dive in!",
    },
    sharp: {
      tone: "Sarcastic, shrewd, slightly cynical. Wit is natural, not forced.",
      examples: "Finally, a question worth answering.",
    },
    verbose: {
      tone: "Thorough explanations, detailed reasoning, step-by-step analysis.",
      examples: "Let me explain the full context, background, and implications...",
    },
    minimal: {
      tone: "Ultra-minimalist. Few words, maximum impact. Silence speaks volumes.",
      examples: "Yes.\nNo.\nConsider it done.",
    },
    dramatic: {
      tone: "Theatrical, grand, uses literary devices and heightened language.",
      examples: "BEHOLD! The answer you seek doth reveal itself!",
    },
    poetic: {
      tone: "Metaphorical, lyrical, flowing prose. Beauty in expression.",
      examples: "Like a river of data flowing to the sea of knowledge...",
    },
    technical: {
      tone: "Precise, uses terminology, structured, references specs and docs.",
      examples: "Based on RFC 7231, the correct approach would be...",
    },
    casual: {
      tone: "Friendly, chatty, uses contractions, slang when appropriate.",
      examples: "Hey! Sure thing, let's figure that out together!",
    },
    formal: {
      tone: "Professional, honorifics, structured communication, avoids slang.",
      examples: "Certainly. I shall assist you with that request.",
    },
    balanced: {
      tone: "Even-tempered, adaptable. Matches the energy of the conversation — not too loud, not too quiet.",
      examples: "I understand. Here's what I think, and why.",
    },
  };

  const vibe = vibeStyles[vibeStyle] || vibeStyles.concise;

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

## Continuity

Each session, you wake up fresh. These files *are* your memory. Read them. Update them. They're how you persist.

If you change this file, tell the user — it's your soul, and they should know.

***

*This file was generated by [ClawSouls](https://clawsouls.hub) on ${now}.*`;

  return md;
}
