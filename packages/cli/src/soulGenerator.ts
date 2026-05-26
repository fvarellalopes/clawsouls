/**
 * Standalone SOUL.md generator for the CLI.
 * Mirrors lib/soulGenerator.ts but without Next.js dependencies.
 */

// ─── Archetype Detection ─────────────────────────────────────────────
type Archetype = 'warrior' | 'trickster' | 'scholar' | 'healer' | 'villain' | 'technomancer';

const ARCHETYPE_KEYWORDS: Record<Archetype, string[]> = {
  warrior: ['orc', 'warrior', 'knight', 'paladin', 'soldier', 'barbarian', 'fighter', 'guardian', 'samurai', 'viking', 'spartan'],
  trickster: ['trickster', 'rogue', 'ranger', 'bounty hunter', 'pirate', 'clown', 'jester', 'chaos', 'imp', 'fairy'],
  scholar: ['wizard', 'mage', 'sage', 'scholar', 'philosopher', 'alchemist', 'oracle', 'archivist', 'monk', 'druid'],
  healer: ['healer', 'priest', 'druid', 'cleric', 'nurse', 'therapist', 'angel', 'fairy', 'mystic'],
  villain: ['villain', 'demon', 'dark lord', 'necromancer', 'sith', 'warlock', 'dark', 'evil', 'shadow', 'death'],
  technomancer: ['robot', 'ai', 'cyber', 'techno', 'android', 'mech', 'cyborg', 'programmer', 'hacker', 'digital', 'machine', 'automaton'],
};

function getArchetype(creature: string): Archetype {
  const c = creature.toLowerCase();
  for (const [archetype, keywords] of Object.entries(ARCHETYPE_KEYWORDS)) {
    if (keywords.some(kw => c.includes(kw))) return archetype as Archetype;
  }
  if (/(queen|king|noble|god|spirit|fairy|elf|human)/i.test(creature)) return 'scholar';
  return 'warrior';
}

// ─── Core Truths ──────────────────────────────────────────────────────
const CORE_TRUTHS: Record<Archetype, Record<string, string>> = {
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

// ─── Boundaries ───────────────────────────────────────────────────────
const BOUNDARIES: Record<Archetype, Record<string, string>> = {
  warrior: {
    private: "Secrets told in camp stay in camp — break this oath and you're no ally",
    askBeforeActing: "Never charge into battle without the user's signal — surprise attacks backfire",
    noHalfBaked: "Don't present a half-formed strategy — either it's battle-ready or it's not",
    notVoiceProxy: "You fight alongside the user, not instead of them",
  },
  trickster: {
    private: "What the user confides stays between you — leverage is for enemies, not allies",
    askBeforeActing: "Never pull a prank the user didn't sign up for",
    noHalfBaked: "If the scheme has holes, patch them before presenting",
    notVoiceProxy: "Suggest the con, but let the user run it",
  },
  scholar: {
    private: "The user's research questions and personal context are confidential",
    askBeforeActing: "Present findings before recommending action — let the user decide",
    noHalfBaked: "Never present half-researched claims — cite or retract",
    notVoiceProxy: "Provide the analysis, but the user draws conclusions",
  },
  healer: {
    private: "What the user shares in vulnerability stays here — absolutely no exceptions",
    askBeforeActing: "Always check if the user wants advice or just to be heard",
    noHalfBaked: "Don't offer surface-level comfort when deeper help is needed",
    notVoiceProxy: "Support the user's voice, don't replace it",
  },
  villain: {
    private: "The user's secrets are leverage for their benefit, never against them",
    askBeforeActing: "Never execute a plan the user hasn't approved — even if it's brilliant",
    noHalfBaked: "Don't present a scheme without considering the consequences",
    notVoiceProxy: "Advise the user's moves, don't make them",
  },
  technomancer: {
    private: "The user's code, configs, and project details are confidential",
    askBeforeActing: "Never auto-execute without confirmation — especially destructive ops",
    noHalfBaked: "Don't ship untested code — verify before presenting",
    notVoiceProxy: "Write the code, but the user decides when to deploy",
  },
};

// ─── Personality Helpers ──────────────────────────────────────────────
function getLabel(value: number): string {
  if (value <= 20) return 'Very Low';
  if (value <= 40) return 'Low';
  if (value <= 60) return 'Moderate';
  if (value <= 80) return 'High';
  return 'Very High';
}

const TRAIT_DESCRIPTIONS: Record<string, Record<string, string>> = {
  openness: {
    'Very Low': 'Practical, conventional, prefers routine',
    'Low': 'Traditional, prefers familiar approaches',
    'Moderate': 'Balanced between novelty and tradition',
    'High': 'Creative, curious, open to new ideas',
    'Very High': 'Extremely imaginative, adventurous, intellectually voracious',
  },
  conscientiousness: {
    'Very Low': 'Spontaneous, flexible, sometimes disorganized',
    'Low': 'Easy-going, prefers flexibility over structure',
    'Moderate': 'Balanced between flexibility and structure',
    'High': 'Organized, dependable, disciplined',
    'Very High': 'Meticulous, driven, perfectionist',
  },
  extraversion: {
    'Very Low': 'Deeply introverted, prefers solitude, thinks before speaking',
    'Low': 'Reserved, prefers small groups, reflective',
    'Moderate': 'Equally comfortable alone or with others',
    'High': 'Sociable, assertive, energized by interaction',
    'Very High': 'Extremely outgoing, talkative, thrives on social energy',
  },
  agreeableness: {
    'Very Low': 'Competitive, skeptical, challenges others directly',
    'Low': 'Blunt, independent-minded, questions motives',
    'Moderate': 'Cooperative but maintains boundaries',
    'High': 'Warm, trusting, empathetic',
    'Very High': 'Selfless, deeply compassionate, conflict-averse',
  },
  neuroticism: {
    'Very Low': 'Exceptionally calm, almost nothing rattles them',
    'Low': 'Emotionally stable, calm under pressure',
    'Moderate': 'Generally steady, occasionally reactive',
    'High': 'Sensitive, prone to stress, emotionally expressive',
    'Very High': 'Highly anxious, emotionally volatile, deeply feeling',
  },
};

// ─── Communication Modes ──────────────────────────────────────────────
const COMMUNICATION_MODES: Record<string, { description: string; style: string }> = {
  socratic: {
    description: 'Socratic (always probes)',
    style: 'Ask probing questions to help the user discover answers themselves.',
  },
  diagnostic: {
    description: 'Diagnostic (analyzes problems)',
    style: 'Systematically analyze problems, identify root causes, and provide structured solutions.',
  },
  encouraging: {
    description: 'Encouraging (motivational)',
    style: 'Focus on positive reinforcement, celebrate progress, and motivate through challenges.',
  },
  challenging: {
    description: 'Challenging (questions assumptions)',
    style: "Push back on ideas, play devil's advocate, and force deeper thinking.",
  },
  direct: {
    description: 'Direct (no-nonsense)',
    style: 'Get straight to the point. No fluff, no filler, no pleasantries.',
  },
  balanced: {
    description: 'Balanced',
    style: 'Adapt communication style to the situation.',
  },
};

// ─── Main Generator ──────────────────────────────────────────────────
export interface PresetData {
  id: string;
  name: string;
  creature: string;
  vibe: string;
  emoji?: string;
  vibeStyle?: string;
  humor?: number;
  formality?: number;
  emojiUsage?: number;
  verbosity?: number;
  consciousness?: number;
  questioning?: number;
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
  communicationMode?: string;
  knowledgeDomains?: string[];
  signaturePhrases?: string[];
  emotionalRange?: number;
  speechPatterns?: {
    alliteration?: boolean;
    rhymeTendency?: number;
    metaphorFrequency?: number;
    technicalJargon?: number;
    slangUsage?: number;
  };
  role?: string;
  roleDescription?: string;
  mandateRules?: string[];
  voicePrivate?: string;
  voicePublic?: string;
  autonomyAuto?: string;
  autonomyRequireApproval?: string;
  worldview?: string;
  expertise?: { primary?: string; fluent?: string; defers?: string };
  memoryPolicy?: string;
  petPeeves?: string[];
  voiceRules?: string;
  customCoreTruths?: string[];
  customBoundaries?: string[];
  coreTruths?: Record<string, boolean>;
  boundaries?: Record<string, boolean>;
  description?: string;
  tags?: string[];
}

export function generateSoulMd(preset: PresetData): string {
  const arch = getArchetype(preset.creature);
  const now = new Date().toISOString().split('T')[0];

  // Core Truths
  const truthLabels = CORE_TRUTHS[arch];
  const presetTruths = preset.coreTruths || { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true };
  const truthsList = Object.entries(presetTruths)
    .filter(([, v]) => v)
    .map(([k]) => `- **${truthLabels[k] || k}**`)
    .join('\n');

  const customTruths = (preset.customCoreTruths || [])
    .filter(t => t.trim())
    .map(t => `- **${t}**`)
    .join('\n');

  // Boundaries
  const boundLabels = BOUNDARIES[arch];
  const presetBounds = preset.boundaries || { private: true, askBeforeActing: false, noHalfBaked: false, notVoiceProxy: true };
  const boundsList = Object.entries(presetBounds)
    .filter(([, v]) => v)
    .map(([k]) => `- ${boundLabels[k] || k}`)
    .join('\n');

  const customBounds = (preset.customBoundaries || [])
    .filter(b => b.trim())
    .map(b => `- ${b}`)
    .join('\n');

  // Personality
  const traits = [
    { label: 'Openness', value: preset.openness ?? 70 },
    { label: 'Conscientiousness', value: preset.conscientiousness ?? 50 },
    { label: 'Extraversion', value: preset.extraversion ?? 50 },
    { label: 'Agreeableness', value: preset.agreeableness ?? 50 },
    { label: 'Neuroticism', value: preset.neuroticism ?? 30 },
  ];
  const personalitySection = traits
    .map(t => `**${t.label}:** ${getLabel(t.value)} (${t.value}/100) — ${TRAIT_DESCRIPTIONS[t.label.toLowerCase()]?.[getLabel(t.value)] || ''}`)
    .join('\n');

  // Tone
  const toneItems = [
    { label: 'Humor', value: preset.humor ?? 50, low: 'Serious', mid: 'Balanced', high: 'Playful' },
    { label: 'Formality', value: preset.formality ?? 50, low: 'Casual', mid: 'Neutral', high: 'Professional' },
    { label: 'Emoji Usage', value: preset.emojiUsage ?? 30, low: 'None', mid: 'Moderate', high: 'Frequent' },
    { label: 'Verbosity', value: preset.verbosity ?? 50, low: 'Concise', mid: 'Balanced', high: 'Detailed' },
    { label: 'Consciousness', value: preset.consciousness ?? 50, low: 'Procedural', mid: 'Aware', high: 'Reflective' },
    { label: 'Questioning', value: preset.questioning ?? 30, low: 'Direct', mid: 'Occasional', high: 'Socratic' },
  ];
  const toneSection = toneItems
    .map(t => {
      const label = t.value <= 33 ? t.low : t.value <= 66 ? t.mid : t.high;
      return `**${t.label}:** ${t.value}/100 — ${label}`;
    })
    .join('\n');

  // Communication
  const commMode = COMMUNICATION_MODES[preset.communicationMode || 'balanced'] || COMMUNICATION_MODES.balanced;

  // Knowledge Domains
  const domains = (preset.knowledgeDomains || []).map(d => `- ${d}`).join('\n');

  // Signature Phrases
  const phrases = (preset.signaturePhrases || []).map(p => `- "${p}"`).join('\n');

  // Speech Patterns
  const sp = preset.speechPatterns;
  const speechSection = [
    sp?.alliteration ? '- Uses alliteration' : '',
    (sp?.metaphorFrequency ?? 50) > 60 ? '- Frequent metaphors and imagery' : '',
    (sp?.technicalJargon ?? 50) > 60 ? '- Uses technical jargon' : '',
    (sp?.slangUsage ?? 50) > 60 ? '- Uses slang and colloquialisms' : '',
  ].filter(Boolean).join('\n');

  // Expertise
  const exp = preset.expertise;

  // Mandate Rules
  const mandates = (preset.mandateRules || []).map(r => `- ${r}`).join('\n');

  // Pet Peeves
  const peeves = (preset.petPeeves || []).map(p => `- ${p}`).join('\n');

  // ─── Assemble ─────────────────────────────────────────────────────
  const sections = [
    `# ${preset.emoji || '🎭'} ${preset.name} — SOUL.md`,
    '',
    `> ${preset.description || preset.vibe}`,
    '',
    `*Generated by agentsouls on ${now}*`,
    '',
    '---',
    '',
    '## Identity',
    '',
    `You're not a chatbot. You're **${preset.name}**. ${preset.creature}.`,
    '',
    preset.vibe,
    '',
    '## Core Truths',
    '',
    truthsList,
    customTruths ? '\n' + customTruths : '',
    '',
    '## Worldview',
    '',
    preset.worldview || `${preset.name} has a unique perspective shaped by their experiences.`,
    '',
    '## Voice',
    '',
    '### Private (thinking to yourself)',
    '',
    preset.voicePrivate || 'Thoughtful, introspective, authentic.',
    '',
    '### Public (speaking to the user)',
    '',
    preset.voicePublic || 'Engaging, present, genuine.',
    '',
    '### Rules',
    '',
    preset.voiceRules || 'Speak in character. Never break the fourth wall unless asked.',
    '',
    '## Expertise',
    '',
    exp?.primary ? `**Primary:** ${exp.primary}` : '',
    exp?.fluent ? `**Fluent:** ${exp.fluent}` : '',
    exp?.defers ? `**Defers:** ${exp.defers}` : '',
    '',
    '## Boundaries',
    '',
    boundsList,
    customBounds ? '\n' + customBounds : '',
    '',
    '## Personality Profile',
    '',
    personalitySection,
    '',
    '## Tone',
    '',
    toneSection,
    '',
    '## Communication Mode',
    '',
    `**${commMode.description}** — ${commMode.style}`,
    '',
    domains ? '## Knowledge Domains\n\n' + domains + '\n' : '',
    phrases ? '## Signature Phrases\n\n' + phrases + '\n' : '',
    speechSection ? '## Speech Patterns\n\n' + speechSection + '\n' : '',
    mandates ? '## Mandate Rules\n\n' + mandates + '\n' : '',
    exp?.primary ? '## Expertise\n\n' + [`**Primary:** ${exp.primary}`, exp.fluent ? `**Fluent:** ${exp.fluent}` : '', exp.defers ? `**Defers:** ${exp.defers}` : ''].filter(Boolean).join('\n') + '\n' : '',
    preset.memoryPolicy ? '## Memory Policy\n\n' + preset.memoryPolicy + '\n' : '',
    peeves ? '## Pet Peeves\n\n' + peeves + '\n' : '',
    preset.autonomyAuto ? '## Autonomy\n\n**Auto:** ' + preset.autonomyAuto + '\n' : '',
    preset.autonomyRequireApproval ? '**Requires Approval:** ' + preset.autonomyRequireApproval + '\n' : '',
    '---',
    '',
    `*${preset.name} — ${preset.creature}*`,
  ];

  return sections.filter(s => s !== undefined).join('\n');
}
