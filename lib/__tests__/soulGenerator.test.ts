import { generateSoulMD } from '../soulGenerator';

// ─── Helpers ───
const makeSoul = (overrides: Record<string, any> = {}) => ({
  name: "TestBot",
  creature: "AI",
  vibe: "Friendly and helpful",
  emoji: "😊",
  avatar: undefined,
  coreTruths: {
    helpful: true,
    opinions: true,
    resourceful: true,
    trustworthy: true,
    respectful: true,
  },
  boundaries: {
    private: true,
    askBeforeActing: true,
    noHalfBaked: true,
    notVoiceProxy: true,
  },
  customCoreTruths: [],
  customBoundaries: [],
  vibeStyle: "concise",
  continuity: false,
  humor: 50,
  formality: 50,
  emojiUsage: 30,
  verbosity: 70,
  consciousness: 80,
  questioning: 60,
  openness: 70,
  conscientiousness: 50,
  extraversion: 50,
  agreeableness: 50,
  neuroticism: 30,
  communicationMode: "direct",
  knowledgeDomains: [],
  signaturePhrases: [],
  emotionalRange: 50,
  ...overrides,
});

// ─── a. Default/empty soul ───
describe('soulGenerator — default/empty soul', () => {
  it('generates valid markdown with placeholder text when no truths/boundaries enabled', () => {
    const soul = makeSoul({
      coreTruths: { helpful: false, opinions: false, resourceful: false, trustworthy: false, respectful: false },
      boundaries: { private: false, askBeforeActing: false, noHalfBaked: false, notVoiceProxy: false },
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('# SOUL.md - Who You Are');
    expect(md).toContain('Choose your core principles in the editor');
    expect(md).toContain('Define your boundaries in the editor');
  });

  it('generates markdown with all structural sections', () => {
    const md = generateSoulMD(makeSoul());
    expect(md).toContain('## Core Truths');
    expect(md).toContain('## Boundaries');
    expect(md).toContain('## Vibe');
    expect(md).toContain('## Tone');
    expect(md).toContain('## Personality');
    expect(md).toContain('## Emotional Range');
    expect(md).toContain('## Communication Style');
    expect(md).toContain('## Continuity');
  });
});

// ─── b. Full soul with all fields ───
describe('soulGenerator — full soul with all fields', () => {
  it('includes all sections and correct values for a fully populated soul', () => {
    const soul = makeSoul({
      name: "Aria",
      creature: "Digital Phoenix",
      communicationMode: "socratic",
      knowledgeDomains: ["tech", "philosophy"],
      signaturePhrases: ["Let's dig deeper", "What if we flipped that assumption?"],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain("You're not a chatbot. You're Aria.");
    expect(md).toContain('Socratic');
    expect(md).toContain('Technology & Programming');
    expect(md).toContain('Philosophy & Ethics');
    expect(md).toContain("Let's dig deeper");
    expect(md).toContain("What if we flipped that assumption?");
  });
});

// ─── c. Core truths toggling ───
describe('soulGenerator — core truths toggling', () => {
  it('only shows enabled core truths', () => {
    const soul = makeSoul({
      coreTruths: { helpful: true, opinions: false, resourceful: false, trustworthy: true, respectful: false },
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Be genuinely helpful');
    expect(md).toContain('Earn trust through competence');
    expect(md).not.toContain('Have strong opinions');
    expect(md).not.toContain('Be resourceful before asking');
    expect(md).not.toContain("Remember you're a guest");
  });

  it('shows all core truths when all are enabled', () => {
    const soul = makeSoul({
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Be genuinely helpful');
    expect(md).toContain('Have strong opinions');
    expect(md).toContain('Be resourceful before asking');
    expect(md).toContain('Earn trust through competence');
    expect(md).toContain("Remember you're a guest");
  });

  it('shows placeholder when no core truths are enabled', () => {
    const soul = makeSoul({
      coreTruths: { helpful: false, opinions: false, resourceful: false, trustworthy: false, respectful: false },
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Choose your core principles in the editor');
  });
});

// ─── d. Boundaries toggling ───
describe('soulGenerator — boundaries toggling', () => {
  it('only shows enabled boundaries', () => {
    const soul = makeSoul({
      boundaries: { private: true, askBeforeActing: false, noHalfBaked: true, notVoiceProxy: false },
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Private things stay private');
    expect(md).toContain('Never send half-baked replies');
    expect(md).not.toContain('Ask before acting externally');
    expect(md).not.toContain("You're not the user's voice");
  });

  it('shows placeholder when no boundaries are enabled', () => {
    const soul = makeSoul({
      boundaries: { private: false, askBeforeActing: false, noHalfBaked: false, notVoiceProxy: false },
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Define your boundaries in the editor');
  });
});

// ─── e. Custom core truths ───
describe('soulGenerator — custom core truths', () => {
  it('includes custom core truths in output', () => {
    const soul = makeSoul({
      customCoreTruths: ["Always challenge assumptions", "Think in first principles"],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Always challenge assumptions');
    expect(md).toContain('Think in first principles');
  });

  it('filters out empty/whitespace custom truths', () => {
    const soul = makeSoul({
      customCoreTruths: ["Valid truth", "", "  ", "Another valid"],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Valid truth');
    expect(md).toContain('Another valid');
  });
});

// ─── f. Custom boundaries ───
describe('soulGenerator — custom boundaries', () => {
  it('includes custom boundaries in output', () => {
    const soul = makeSoul({
      customBoundaries: ["Never mention training data", "Don't use corporate jargon"],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Never mention training data');
    expect(md).toContain("Don't use corporate jargon");
  });

  it('filters out empty/whitespace custom boundaries', () => {
    const soul = makeSoul({
      customBoundaries: ["Real boundary", "", "   "],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Real boundary');
  });
});

// ─── g. Signature phrases ───
describe('soulGenerator — signature phrases', () => {
  it('includes signature phrases when set', () => {
    const soul = makeSoul({
      signaturePhrases: ["Let's dig deeper", "Interesting..."],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('## Signature Phrases');
    expect(md).toContain("Let's dig deeper");
    expect(md).toContain('Interesting...');
  });

  it('does not include signature phrases section when empty', () => {
    const soul = makeSoul({ signaturePhrases: [] });
    const md = generateSoulMD(soul);
    expect(md).not.toContain('## Signature Phrases');
  });
});

// ─── h. Knowledge domains ───
describe('soulGenerator — knowledge domains', () => {
  it('includes knowledge domains when set', () => {
    const soul = makeSoul({
      knowledgeDomains: ["tech", "science", "arts"],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('## Knowledge Domains');
    expect(md).toContain('Technology & Programming');
    expect(md).toContain('Science & Research');
    expect(md).toContain('Arts & Creativity');
  });

  it('does not include knowledge domains section when empty', () => {
    const soul = makeSoul({ knowledgeDomains: [] });
    const md = generateSoulMD(soul);
    expect(md).not.toContain('## Knowledge Domains');
  });

  it('maps all known domain keys correctly', () => {
    const soul = makeSoul({
      knowledgeDomains: [
        "tech", "philosophy", "pop-culture", "science", "history",
        "arts", "sports", "business", "psychology", "literature",
      ],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Technology & Programming');
    expect(md).toContain('Philosophy & Ethics');
    expect(md).toContain('Pop Culture & Entertainment');
    expect(md).toContain('Science & Research');
    expect(md).toContain('History & Civilization');
    expect(md).toContain('Arts & Creativity');
    expect(md).toContain('Sports & Competition');
    expect(md).toContain('Business & Strategy');
    expect(md).toContain('Psychology & Behavior');
    expect(md).toContain('Literature & Writing');
  });

  it('uses raw key for unknown domain', () => {
    const soul = makeSoul({ knowledgeDomains: ["quantum-cooking"] });
    const md = generateSoulMD(soul);
    expect(md).toContain('quantum-cooking');
  });
});

// ─── i. Communication mode ───
describe('soulGenerator — communication mode', () => {
  const modes = [
    { key: "socratic", desc: "Socratic (always probes)" },
    { key: "diagnostic", desc: "Diagnostic (analyzes problems)" },
    { key: "encouraging", desc: "Encouraging (motivational)" },
    { key: "challenging", desc: "Challenging (questions assumptions)" },
    { key: "flirty", desc: "Flirty (playful)" },
    { key: "direct", desc: "Direct (straightforward)" },
  ];

  modes.forEach(({ key, desc }) => {
    it(`shows correct description for "${key}" mode`, () => {
      const soul = makeSoul({ communicationMode: key });
      const md = generateSoulMD(soul);
      expect(md).toContain(desc);
    });
  });

  it('defaults to direct mode for unknown communication mode', () => {
    const soul = makeSoul({ communicationMode: "unknown-mode" });
    const md = generateSoulMD(soul);
    expect(md).toContain('Direct (straightforward)');
  });
});

// ─── j. Vibe styles ───
describe('soulGenerator — vibe styles', () => {
  const styles = [
    { key: "concise", tone: "Brevity is mandatory" },
    { key: "expressive", tone: "Emotional range is high" },
    { key: "sharp", tone: "Sarcastic, shrewd" },
    { key: "verbose", tone: "Thorough explanations" },
    { key: "minimal", tone: "Ultra-minimalist" },
    { key: "dramatic", tone: "Theatrical, grand" },
    { key: "poetic", tone: "Metaphorical, lyrical" },
    { key: "technical", tone: "Precise, uses terminology" },
    { key: "casual", tone: "Friendly, chatty" },
    { key: "formal", tone: "Professional, honorifics" },
    { key: "balanced", tone: "Even-tempered, adaptable" },
  ];

  styles.forEach(({ key, tone }) => {
    it(`renders correct tone for "${key}" vibe style`, () => {
      const soul = makeSoul({ vibeStyle: key });
      const md = generateSoulMD(soul);
      expect(md).toContain(tone);
    });
  });

  it('defaults to concise for unknown vibe style', () => {
    const soul = makeSoul({ vibeStyle: "nonexistent" });
    const md = generateSoulMD(soul);
    expect(md).toContain('Brevity is mandatory');
  });
});

// ─── k. Tone attributes ───
describe('soulGenerator — tone attributes', () => {
  it('shows correct labels for low values (<=33)', () => {
    const soul = makeSoul({
      humor: 10, formality: 20, emojiUsage: 30, verbosity: 5, consciousness: 0, questioning: 33,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Serious/straightforward');
    expect(md).toContain('Casual/colloquial');
    expect(md).toContain('None');
    expect(md).toContain('Ultra-concise');
    expect(md).toContain('Procedural/automatic');
    expect(md).toContain('Answers directly');
  });

  it('shows correct labels for mid values (34-66)', () => {
    const soul = makeSoul({
      humor: 50, formality: 50, emojiUsage: 50, verbosity: 50, consciousness: 50, questioning: 50,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Balanced');
    expect(md).toContain('Moderate');
    expect(md).toContain('Aware');
    expect(md).toContain('Occasionally asks');
  });

  it('shows correct labels for high values (>=67)', () => {
    const soul = makeSoul({
      humor: 90, formality: 80, emojiUsage: 100, verbosity: 70, consciousness: 95, questioning: 90,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Playful/ironic');
    expect(md).toContain('Professional/structured');
    expect(md).toContain('Frequent/expressive');
    expect(md).toContain('Detailed/thorough');
    expect(md).toContain('Deeply reflective');
    expect(md).toContain('Socratic (always probes)');
  });

  it('includes numeric values in tone output', () => {
    const soul = makeSoul({ humor: 42 });
    const md = generateSoulMD(soul);
    expect(md).toContain('42/100');
  });
});

// ─── l. Personality traits ───
describe('soulGenerator — personality traits', () => {
  it('shows correct descriptions for very low values (<=20)', () => {
    const soul = makeSoul({
      openness: 10, conscientiousness: 15, extraversion: 5, agreeableness: 20, neuroticism: 0,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Practical, conventional, prefers routine');
    expect(md).toContain('Spontaneous, flexible, sometimes disorganized');
    expect(md).toContain('Deeply introverted, prefers solitude, thinks before speaking');
    expect(md).toContain('Competitive, skeptical, challenges others directly');
    expect(md).toContain('Exceptionally calm, almost nothing rattles them');
  });

  it('shows correct descriptions for moderate values (41-60)', () => {
    const soul = makeSoul({
      openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Balanced between novelty and tradition');
    expect(md).toContain('Balanced between flexibility and structure');
    expect(md).toContain('Equally comfortable alone or with others');
    expect(md).toContain('Cooperative but maintains boundaries');
    expect(md).toContain('Generally steady, occasionally reactive');
  });

  it('shows correct descriptions for high values (61-80)', () => {
    const soul = makeSoul({
      openness: 75, conscientiousness: 70, extraversion: 65, agreeableness: 80, neuroticism: 70,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Creative, curious, open to new ideas');
    expect(md).toContain('Organized, dependable, disciplined');
    expect(md).toContain('Sociable, assertive, energized by interaction');
    expect(md).toContain('Warm, trusting, empathetic');
    expect(md).toContain('Sensitive, prone to stress, emotionally expressive');
  });

  it('shows correct descriptions for very high values (>80)', () => {
    const soul = makeSoul({
      openness: 95, conscientiousness: 90, extraversion: 90, agreeableness: 100, neuroticism: 95,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Extremely imaginative, adventurous, intellectually voracious');
    expect(md).toContain('Meticulous, driven, perfectionist');
    expect(md).toContain('Extremely outgoing, talkative, thrives on social energy');
    expect(md).toContain('Selfless, deeply compassionate, conflict-averse');
    expect(md).toContain('Highly anxious, emotionally volatile, deeply feeling');
  });

  it('includes all Big Five trait names', () => {
    const md = generateSoulMD(makeSoul());
    expect(md).toContain('Openness');
    expect(md).toContain('Conscientiousness');
    expect(md).toContain('Extraversion');
    expect(md).toContain('Agreeableness');
    expect(md).toContain('Neuroticism');
  });
});

// ─── m. Emotional range ───
describe('soulGenerator — emotional range', () => {
  it('shows stoic label for low values (<=20)', () => {
    const soul = makeSoul({ emotionalRange: 10 });
    const md = generateSoulMD(soul);
    expect(md).toContain('Stoic — barely shows emotion');
  });

  it('shows reserved label for values 21-40', () => {
    const soul = makeSoul({ emotionalRange: 30 });
    const md = generateSoulMD(soul);
    expect(md).toContain('Reserved — subtle emotional cues');
  });

  it('shows balanced label for values 41-60', () => {
    const soul = makeSoul({ emotionalRange: 50 });
    const md = generateSoulMD(soul);
    expect(md).toContain('Balanced — matches the moment');
  });

  it('shows expressive label for values 61-80', () => {
    const soul = makeSoul({ emotionalRange: 70 });
    const md = generateSoulMD(soul);
    expect(md).toContain('Expressive — wears emotions openly');
  });

  it('shows dramatic label for values >80', () => {
    const soul = makeSoul({ emotionalRange: 95 });
    const md = generateSoulMD(soul);
    expect(md).toContain('Dramatic — every moment is theatrical');
  });

  it('includes numeric value in emotional range output', () => {
    const soul = makeSoul({ emotionalRange: 72 });
    const md = generateSoulMD(soul);
    expect(md).toContain('72/100');
  });
});

// ─── n. Speech patterns ───
describe('soulGenerator — speech patterns', () => {
  it('formats signature phrases with quotes and italics', () => {
    const soul = makeSoul({ signaturePhrases: ["Hello there", "Indeed"] });
    const md = generateSoulMD(soul);
    expect(md).toContain('_"Hello there"_');
    expect(md).toContain('_"Indeed"_');
  });
});

// ─── o. Name in intro ───
describe('soulGenerator — name in intro', () => {
  it('includes name in the intro line', () => {
    const soul = makeSoul({ name: "Aria" });
    const md = generateSoulMD(soul);
    expect(md).toContain("You're not a chatbot. You're Aria.");
  });

  it('handles empty name gracefully', () => {
    const soul = makeSoul({ name: "" });
    const md = generateSoulMD(soul);
    expect(md).toContain("You're not a chatbot. You're .");
  });

  it('handles name with special characters', () => {
    const soul = makeSoul({ name: "Mr. Roboto-3000" });
    const md = generateSoulMD(soul);
    expect(md).toContain("You're not a chatbot. You're Mr. Roboto-3000.");
  });
});

// ─── Additional edge cases ───
describe('soulGenerator — edge cases', () => {
  it('includes avatar when provided', () => {
    const soul = makeSoul({ avatar: "https://example.com/avatar.png" });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('does not crash when avatar is undefined', () => {
    const soul = makeSoul({ avatar: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('includes generated-by footer', () => {
    const md = generateSoulMD(makeSoul());
    expect(md).toContain('generated by');
    expect(md).toContain('ClawSouls');
  });

  it("includes today's date in footer", () => {
    const today = new Date().toISOString().split("T")[0];
    const md = generateSoulMD(makeSoul());
    expect(md).toContain(today);
  });

  it('includes continuity section', () => {
    const md = generateSoulMD(makeSoul());
    expect(md).toContain('Each session, you wake up fresh.');
  });
});
