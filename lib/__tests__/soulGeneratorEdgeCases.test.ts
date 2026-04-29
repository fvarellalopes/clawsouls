import { generateSoulMD } from '../soulGenerator';

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
  speechPatterns: {
    alliteration: false,
    rhymeTendency: 10,
    metaphorFrequency: 30,
    technicalJargon: 40,
    slangUsage: 20,
  },
  ...overrides,
});

// ─── Edge case: missing/undefined fields ───
describe('soulGenerator — missing fields', () => {
  it('handles undefined speechPatterns gracefully', () => {
    const soul = makeSoul({ speechPatterns: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
    expect(md).toContain('# SOUL.md');
  });

  it('handles undefined knowledgeDomains gracefully', () => {
    const soul = makeSoul({ knowledgeDomains: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('handles undefined signaturePhrases gracefully', () => {
    const soul = makeSoul({ signaturePhrases: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('handles undefined customCoreTruths gracefully', () => {
    const soul = makeSoul({ customCoreTruths: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('handles undefined customBoundaries gracefully', () => {
    const soul = makeSoul({ customBoundaries: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('handles null values for numeric fields', () => {
    const soul = makeSoul({
      humor: null, formality: null, emojiUsage: null,
      verbosity: null, consciousness: null, questioning: null,
    });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('handles undefined emotionalRange gracefully', () => {
    const soul = makeSoul({ emotionalRange: undefined });
    const md = generateSoulMD(soul);
    expect(md).toContain('50/100'); // should default to 50
  });

  it('handles undefined avatar gracefully', () => {
    const soul = makeSoul({ avatar: undefined });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });
});

// ─── Edge case: boundary values ───
describe('soulGenerator — boundary values', () => {
  it('handles all sliders at 0', () => {
    const soul = makeSoul({
      humor: 0, formality: 0, emojiUsage: 0, verbosity: 0,
      consciousness: 0, questioning: 0, openness: 0,
      conscientiousness: 0, extraversion: 0, agreeableness: 0,
      neuroticism: 0, emotionalRange: 0,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('0/100');
    expect(md).toBeTruthy();
  });

  it('handles all sliders at 100', () => {
    const soul = makeSoul({
      humor: 100, formality: 100, emojiUsage: 100, verbosity: 100,
      consciousness: 100, questioning: 100, openness: 100,
      conscientiousness: 100, extraversion: 100, agreeableness: 100,
      neuroticism: 100, emotionalRange: 100,
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('100/100');
    expect(md).toBeTruthy();
  });

  it('handles personality traits at boundary 21 (Low)', () => {
    const soul = makeSoul({ openness: 21, conscientiousness: 21 });
    const md = generateSoulMD(soul);
    expect(md).toContain('21/100');
    expect(md).toContain('Low');
  });

  it('handles personality traits at boundary 40 (Low)', () => {
    const soul = makeSoul({ openness: 40, extraversion: 40 });
    const md = generateSoulMD(soul);
    expect(md).toContain('40/100');
  });

  it('handles personality traits at boundary 61 (High)', () => {
    const soul = makeSoul({ openness: 61, agreeableness: 61 });
    const md = generateSoulMD(soul);
    expect(md).toContain('61/100');
    expect(md).toContain('High');
  });

  it('handles personality traits at boundary 81 (Very High)', () => {
    const soul = makeSoul({ openness: 81, neuroticism: 81 });
    const md = generateSoulMD(soul);
    expect(md).toContain('81/100');
    expect(md).toContain('Very High');
  });

  it('handles tone attributes at 33 (low boundary)', () => {
    const soul = makeSoul({ humor: 33, formality: 33, emojiUsage: 33 });
    const md = generateSoulMD(soul);
    expect(md).toContain('33/100');
  });

  it('handles tone attributes at 34 (mid boundary)', () => {
    const soul = makeSoul({ humor: 34, formality: 34 });
    const md = generateSoulMD(soul);
    expect(md).toContain('34/100');
  });

  it('handles tone attributes at 66 (mid boundary)', () => {
    const soul = makeSoul({ humor: 66, formality: 66 });
    const md = generateSoulMD(soul);
    expect(md).toContain('66/100');
  });

  it('handles tone attributes at 67 (high boundary)', () => {
    const soul = makeSoul({ humor: 67, formality: 67 });
    const md = generateSoulMD(soul);
    expect(md).toContain('67/100');
  });
});

// ─── Special characters ───
describe('soulGenerator — special characters', () => {
  it('handles name with unicode characters', () => {
    const soul = makeSoul({ name: 'Ñoño 机器人' });
    const md = generateSoulMD(soul);
    expect(md).toContain('Ñoño 机器人');
  });

  it('handles name with markdown special chars', () => {
    const soul = makeSoul({ name: '**Bold** _Italic_ `Code`' });
    const md = generateSoulMD(soul);
    expect(md).toContain('**Bold** _Italic_ `Code`');
  });

  it('handles custom truths with special chars', () => {
    const soul = makeSoul({
      customCoreTruths: ['Use <html> tags', 'Price is $100 & up', 'Path: C:\\Users\\test'],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('<html>');
    expect(md).toContain('$100 & up');
    expect(md).toContain('C:\\Users\\test');
  });

  it('handles signature phrases with quotes and apostrophes', () => {
    const soul = makeSoul({
      signaturePhrases: ["It's a beautiful day", 'She said "hello"', "Don't worry"],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain("It's a beautiful day");
    expect(md).toContain('She said "hello"');
    expect(md).toContain("Don't worry");
  });

  it('handles very long signature phrase', () => {
    const longPhrase = 'A'.repeat(500);
    const soul = makeSoul({ signaturePhrases: [longPhrase] });
    const md = generateSoulMD(soul);
    expect(md).toContain(longPhrase);
  });

  it('handles emoji in custom truths', () => {
    const soul = makeSoul({ customCoreTruths: ['Always use 🎯 precision', 'Stay 🔥 focused'] });
    const md = generateSoulMD(soul);
    expect(md).toContain('🎯');
    expect(md).toContain('🔥');
  });
});

// ─── All vibe styles ───
describe('soulGenerator — all vibe styles render without errors', () => {
  const allStyles = ['concise', 'expressive', 'sharp', 'verbose', 'minimal', 'dramatic', 'poetic', 'technical', 'casual', 'formal', 'balanced'];

  allStyles.forEach((style) => {
    it(`renders "${style}" without errors and contains vibe section`, () => {
      const soul = makeSoul({ vibeStyle: style });
      const md = generateSoulMD(soul);
      expect(md).toBeTruthy();
      expect(md).toContain('# SOUL.md');
      expect(md).toContain('## Vibe');
      expect(md.length).toBeGreaterThan(100);
    });
  });

  it('renders unknown vibe style as concise fallback', () => {
    const soul = makeSoul({ vibeStyle: 'nonexistent-style' });
    const md = generateSoulMD(soul);
    expect(md).toContain('Brevity is mandatory'); // concise tone
  });
});

// ─── All communication modes ───
describe('soulGenerator — all communication modes render without errors', () => {
  const allModes = ['socratic', 'diagnostic', 'encouraging', 'challenging', 'flirty', 'direct'];

  allModes.forEach((mode) => {
    it(`renders "${mode}" mode without errors`, () => {
      const soul = makeSoul({ communicationMode: mode });
      const md = generateSoulMD(soul);
      expect(md).toBeTruthy();
      expect(md).toContain('## Communication Style');
    });
  });

  it('renders unknown communication mode as direct fallback', () => {
    const soul = makeSoul({ communicationMode: 'nonexistent' });
    const md = generateSoulMD(soul);
    expect(md).toContain('Direct (straightforward)');
  });
});

// ─── All knowledge domains ───
describe('soulGenerator — all knowledge domains', () => {
  const allDomains = ['tech', 'philosophy', 'pop-culture', 'science', 'history', 'arts', 'sports', 'business', 'psychology', 'literature'];

  it('renders all known domains together', () => {
    const soul = makeSoul({ knowledgeDomains: allDomains });
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

  it('does not show Knowledge Domains section when empty', () => {
    const soul = makeSoul({ knowledgeDomains: [] });
    const md = generateSoulMD(soul);
    expect(md).not.toContain('## Knowledge Domains');
  });

  it('filters out whitespace-only domains', () => {
    const soul = makeSoul({ knowledgeDomains: ['tech', '  ', '', 'science'] });
    const md = generateSoulMD(soul);
    expect(md).toContain('Technology & Programming');
    expect(md).toContain('Science & Research');
  });

  it('uses raw key for unknown domains', () => {
    const soul = makeSoul({ knowledgeDomains: ['quantum-cooking', 'space-farming'] });
    const md = generateSoulMD(soul);
    expect(md).toContain('quantum-cooking');
    expect(md).toContain('space-farming');
  });
});

// ─── Empty fields ───
describe('soulGenerator — empty string fields', () => {
  it('handles empty name gracefully', () => {
    const soul = makeSoul({ name: '' });
    const md = generateSoulMD(soul);
    expect(md).toContain("You're not a chatbot. You're .");
  });

  it('handles empty creature without errors', () => {
    const soul = makeSoul({ creature: '' });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('handles empty vibe without errors', () => {
    const soul = makeSoul({ vibe: '' });
    const md = generateSoulMD(soul);
    expect(md).toBeTruthy();
  });

  it('filters out whitespace-only custom truths', () => {
    const soul = makeSoul({ customCoreTruths: ['   ', '\t', '\n', 'Valid truth'] });
    const md = generateSoulMD(soul);
    expect(md).toContain('Valid truth');
    // Should not contain empty bold markers
    expect(md).not.toMatch(/\*\*\s+\*\*/);
  });

  it('filters out whitespace-only custom boundaries', () => {
    const soul = makeSoul({ customBoundaries: ['   ', 'Valid boundary', ''] });
    const md = generateSoulMD(soul);
    expect(md).toContain('Valid boundary');
  });

  it('filters out whitespace-only signature phrases', () => {
    const soul = makeSoul({ signaturePhrases: ['  ', 'Real phrase', ''] });
    const md = generateSoulMD(soul);
    expect(md).toContain('Real phrase');
  });
});

// ─── Structural completeness ───
describe('soulGenerator — structural completeness', () => {
  it('always includes core structural sections', () => {
    const md = generateSoulMD(makeSoul());
    const sections = [
      '# SOUL.md',
      '## Core Truths',
      '## Boundaries',
      '## Vibe',
      '## Tone',
      '## Personality',
      '## Emotional Range',
      '## Communication Style',
      '## Continuity',
    ];
    sections.forEach((section) => {
      expect(md).toContain(section);
    });
  });

  it('conditionally includes Knowledge Domains section', () => {
    const withDomains = generateSoulMD(makeSoul({ knowledgeDomains: ['tech'] }));
    expect(withDomains).toContain('## Knowledge Domains');

    const withoutDomains = generateSoulMD(makeSoul({ knowledgeDomains: [] }));
    expect(withoutDomains).not.toContain('## Knowledge Domains');
  });

  it('conditionally includes Signature Phrases section', () => {
    const withPhrases = generateSoulMD(makeSoul({ signaturePhrases: ['Hello'] }));
    expect(withPhrases).toContain('## Signature Phrases');

    const withoutPhrases = generateSoulMD(makeSoul({ signaturePhrases: [] }));
    expect(withoutPhrases).not.toContain('## Signature Phrases');
  });

  it('includes the ClawSouls attribution', () => {
    const md = generateSoulMD(makeSoul());
    expect(md).toContain('generated by');
    expect(md).toContain('ClawSouls');
  });

  it('includes today date in ISO format', () => {
    const today = new Date().toISOString().split('T')[0];
    const md = generateSoulMD(makeSoul());
    expect(md).toContain(today);
  });

  it('includes continuity instructions', () => {
    const md = generateSoulMD(makeSoul());
    expect(md).toContain('Each session, you wake up fresh');
    expect(md).toContain('your soul');
  });

  it('includes the intro line with name', () => {
    const md = generateSoulMD(makeSoul({ name: 'Aria' }));
    expect(md).toContain("You're not a chatbot. You're Aria.");
  });

  it('returns a non-empty string for any valid soul', () => {
    const md = generateSoulMD(makeSoul());
    expect(md.length).toBeGreaterThan(200);
  });
});

// ─── Multiple custom entries ───
describe('soulGenerator — multiple custom entries', () => {
  it('renders multiple custom core truths', () => {
    const soul = makeSoul({
      customCoreTruths: ['First truth', 'Second truth', 'Third truth'],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('First truth');
    expect(md).toContain('Second truth');
    expect(md).toContain('Third truth');
  });

  it('renders multiple custom boundaries', () => {
    const soul = makeSoul({
      customBoundaries: ['Boundary A', 'Boundary B', 'Boundary C'],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Boundary A');
    expect(md).toContain('Boundary B');
    expect(md).toContain('Boundary C');
  });

  it('renders multiple signature phrases', () => {
    const soul = makeSoul({
      signaturePhrases: ['Hello there', 'Indeed', 'Let me think'],
    });
    const md = generateSoulMD(soul);
    expect(md).toContain('Hello there');
    expect(md).toContain('Indeed');
    expect(md).toContain('Let me think');
  });
});

// ─── Combined features ───
describe('soulGenerator — combined features', () => {
  it('renders a fully populated soul with all features', () => {
    const soul = makeSoul({
      name: 'Aria',
      creature: 'Digital Phoenix',
      emoji: '🔥',
      vibe: 'Warm and curious',
      coreTruths: { helpful: true, opinions: true, resourceful: false, trustworthy: true, respectful: false },
      boundaries: { private: true, askBeforeActing: false, noHalfBaked: true, notVoiceProxy: false },
      customCoreTruths: ['Think in first principles'],
      customBoundaries: ['Never mention training data'],
      vibeStyle: 'expressive',
      communicationMode: 'socratic',
      knowledgeDomains: ['tech', 'philosophy'],
      signaturePhrases: ["Let's dig deeper", 'What if...?'],
      humor: 85,
      formality: 15,
      emotionalRange: 90,
    });
    const md = generateSoulMD(soul);

    expect(md).toContain('Aria');
    expect(md).toContain('## Core Truths');
    expect(md).toContain('## Boundaries');
    expect(md).toContain('Think in first principles');
    expect(md).toContain('Never mention training data');
    expect(md).toContain('Emotional range is high');
    expect(md).toContain('Socratic');
    expect(md).toContain('Technology & Programming');
    expect(md).toContain('Philosophy & Ethics');
    expect(md).toContain("Let's dig deeper");
    expect(md).toContain('What if...?');
    expect(md).toContain('85/100');
    expect(md).toContain('15/100');
    expect(md).toContain('90/100');
  });
});
