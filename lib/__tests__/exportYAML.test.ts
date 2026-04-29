import { exportYAML, SoulExportState } from '../exportYAML';

// ─── Helpers ──────────────────────────────────────────────────────────
const makeSoul = (overrides: Partial<SoulExportState> = {}): SoulExportState => ({
  name: "TestBot",
  creature: "AI",
  vibe: "Friendly and helpful",
  emoji: "😊",
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

// ─── Basic structure ──────────────────────────────────────────────────
describe('exportYAML — basic structure', () => {
  it('produces valid YAML output', () => {
    const yaml = exportYAML(makeSoul());
    expect(yaml).toBeTruthy();
    expect(typeof yaml).toBe('string');
  });

  it('starts with a ClawSouls header comment', () => {
    const yaml = exportYAML(makeSoul());
    expect(yaml).toContain('# ClawSouls — AI Personality Export');
  });

  it('includes generation date', () => {
    const today = new Date().toISOString().split("T")[0];
    const yaml = exportYAML(makeSoul());
    expect(yaml).toContain(today);
  });

  it('includes section comment markers', () => {
    const yaml = exportYAML(makeSoul());
    expect(yaml).toContain('# ── Identity');
    expect(yaml).toContain('# ── Vibe');
    expect(yaml).toContain('# ── Core Truths');
    expect(yaml).toContain('# ── Boundaries');
    expect(yaml).toContain('# ── Tone Attributes');
    expect(yaml).toContain('# ── Personality (Big Five)');
    expect(yaml).toContain('# ── Emotional Range');
    expect(yaml).toContain('# ── Communication');
    expect(yaml).toContain('# ── Knowledge Domains');
    expect(yaml).toContain('# ── Speech Patterns');
  });
});

// ─── Identity fields ──────────────────────────────────────────────────
describe('exportYAML — identity fields', () => {
  it('includes name, creature, and emoji', () => {
    const yaml = exportYAML(makeSoul({ name: "Aria", creature: "Digital Phoenix", emoji: "🔥" }));
    expect(yaml).toContain('name: Aria');
    expect(yaml).toContain('creature: Digital Phoenix');
    expect(yaml).toContain('emoji: "\uD83D\uDD25"');
  });

  it('includes avatar when provided', () => {
    const yaml = exportYAML(makeSoul({ avatar: "https://example.com/avatar.png" }));
    expect(yaml).toContain('avatar: https://example.com/avatar.png');
    expect(yaml).toContain('# ── Avatar');
  });

  it('omits avatar section when not provided', () => {
    const yaml = exportYAML(makeSoul({ avatar: undefined }));
    expect(yaml).not.toContain('# ── Avatar');
  });
});

// ─── Vibe ─────────────────────────────────────────────────────────────
describe('exportYAML — vibe', () => {
  it('includes vibe text and style', () => {
    const yaml = exportYAML(makeSoul({ vibe: "Sharp and witty", vibeStyle: "sharp" }));
    expect(yaml).toContain('vibe: Sharp and witty');
    expect(yaml).toContain('vibeStyle: sharp');
  });
});

// ─── Core truths ──────────────────────────────────────────────────────
describe('exportYAML — core truths', () => {
  it('includes all core truth flags', () => {
    const yaml = exportYAML(makeSoul());
    expect(yaml).toContain('coreTruths:');
    expect(yaml).toContain('helpful: true');
    expect(yaml).toContain('opinions: true');
  });

  it('includes custom core truths when present', () => {
    const yaml = exportYAML(makeSoul({
      customCoreTruths: ["Always challenge assumptions", "Think in first principles"],
    }));
    expect(yaml).toContain('customCoreTruths:');
    expect(yaml).toContain('Always challenge assumptions');
    expect(yaml).toContain('Think in first principles');
  });

  it('omits custom core truths when empty', () => {
    const yaml = exportYAML(makeSoul({ customCoreTruths: [] }));
    expect(yaml).not.toContain('customCoreTruths:');
  });
});

// ─── Boundaries ───────────────────────────────────────────────────────
describe('exportYAML — boundaries', () => {
  it('includes all boundary flags', () => {
    const yaml = exportYAML(makeSoul());
    expect(yaml).toContain('boundaries:');
    expect(yaml).toContain('private: true');
    expect(yaml).toContain('askBeforeActing: true');
  });

  it('includes custom boundaries when present', () => {
    const yaml = exportYAML(makeSoul({
      customBoundaries: ["Never mention training data"],
    }));
    expect(yaml).toContain('customBoundaries:');
    expect(yaml).toContain('Never mention training data');
  });

  it('omits custom boundaries when empty', () => {
    const yaml = exportYAML(makeSoul({ customBoundaries: [] }));
    expect(yaml).not.toContain('customBoundaries:');
  });
});

// ─── Tone attributes ─────────────────────────────────────────────────
describe('exportYAML — tone attributes', () => {
  it('includes all tone sliders', () => {
    const yaml = exportYAML(makeSoul({ humor: 75, formality: 20 }));
    expect(yaml).toContain('toneAttributes:');
    expect(yaml).toContain('humor: 75');
    expect(yaml).toContain('formality: 20');
    expect(yaml).toContain('emojiUsage:');
    expect(yaml).toContain('verbosity:');
    expect(yaml).toContain('consciousness:');
    expect(yaml).toContain('questioning:');
  });
});

// ─── Personality (Big Five) ──────────────────────────────────────────
describe('exportYAML — personality', () => {
  it('includes all Big Five traits', () => {
    const yaml = exportYAML(makeSoul({
      openness: 90, conscientiousness: 60, extraversion: 30, agreeableness: 80, neuroticism: 10,
    }));
    expect(yaml).toContain('personality:');
    expect(yaml).toContain('openness: 90');
    expect(yaml).toContain('conscientiousness: 60');
    expect(yaml).toContain('extraversion: 30');
    expect(yaml).toContain('agreeableness: 80');
    expect(yaml).toContain('neuroticism: 10');
  });
});

// ─── Emotional range ─────────────────────────────────────────────────
describe('exportYAML — emotional range', () => {
  it('includes emotional range value', () => {
    const yaml = exportYAML(makeSoul({ emotionalRange: 72 }));
    expect(yaml).toContain('emotionalRange: 72');
  });

  it('defaults to 50 when not provided', () => {
    const yaml = exportYAML(makeSoul({ emotionalRange: undefined }));
    expect(yaml).toContain('emotionalRange: 50');
  });
});

// ─── Communication mode ──────────────────────────────────────────────
describe('exportYAML — communication mode', () => {
  it('includes communication mode', () => {
    const yaml = exportYAML(makeSoul({ communicationMode: "socratic" }));
    expect(yaml).toContain('communicationMode: socratic');
  });
});

// ─── Knowledge domains ───────────────────────────────────────────────
describe('exportYAML — knowledge domains', () => {
  it('includes knowledge domains list', () => {
    const yaml = exportYAML(makeSoul({ knowledgeDomains: ["tech", "philosophy", "science"] }));
    expect(yaml).toContain('knowledgeDomains:');
    expect(yaml).toContain('- tech');
    expect(yaml).toContain('- philosophy');
    expect(yaml).toContain('- science');
  });

  it('includes empty list when no domains set', () => {
    const yaml = exportYAML(makeSoul({ knowledgeDomains: [] }));
    expect(yaml).toContain('knowledgeDomains: []');
  });
});

// ─── Signature phrases ───────────────────────────────────────────────
describe('exportYAML — signature phrases', () => {
  it('includes signature phrases when present', () => {
    const yaml = exportYAML(makeSoul({
      signaturePhrases: ["Let's dig deeper", "Interesting..."],
    }));
    expect(yaml).toContain('# ── Signature Phrases');
    expect(yaml).toContain('signaturePhrases:');
    expect(yaml).toContain("Let's dig deeper");
    expect(yaml).toContain('Interesting...');
  });

  it('omits signature phrases section when empty', () => {
    const yaml = exportYAML(makeSoul({ signaturePhrases: [] }));
    expect(yaml).not.toContain('# ── Signature Phrases');
  });
});

// ─── Speech patterns ─────────────────────────────────────────────────
describe('exportYAML — speech patterns', () => {
  it('includes all speech pattern fields', () => {
    const yaml = exportYAML(makeSoul());
    expect(yaml).toContain('# ── Speech Patterns');
    expect(yaml).toContain('speechPatterns:');
    expect(yaml).toContain('alliteration:');
    expect(yaml).toContain('rhymeTendency:');
    expect(yaml).toContain('metaphorFrequency:');
    expect(yaml).toContain('technicalJargon:');
    expect(yaml).toContain('slangUsage:');
  });

  it('includes custom speech pattern values', () => {
    const yaml = exportYAML(makeSoul({
      speechPatterns: {
        alliteration: true,
        rhymeTendency: 80,
        metaphorFrequency: 60,
        technicalJargon: 20,
        slangUsage: 90,
      },
    }));
    expect(yaml).toContain('alliteration: true');
    expect(yaml).toContain('rhymeTendency: 80');
    expect(yaml).toContain('metaphorFrequency: 60');
    expect(yaml).toContain('technicalJargon: 20');
    expect(yaml).toContain('slangUsage: 90');
  });

  it('omits speech patterns section when not provided', () => {
    const yaml = exportYAML(makeSoul({ speechPatterns: undefined }));
    expect(yaml).not.toContain('# ── Speech Patterns');
    expect(yaml).not.toContain('speechPatterns:');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────
describe('exportYAML — edge cases', () => {
  it('handles empty name gracefully', () => {
    const yaml = exportYAML(makeSoul({ name: "" }));
    expect(yaml).toContain('name: ""');
  });

  it('handles special characters in name', () => {
    const yaml = exportYAML(makeSoul({ name: "Mr. Roboto-3000" }));
    expect(yaml).toContain('name: Mr. Roboto-3000');
  });

  it('handles name with colons', () => {
    const yaml = exportYAML(makeSoul({ name: "Bot: The Sequel" }));
    expect(yaml).toContain('name: "Bot: The Sequel"');
  });

  it('produces consistent output for the same input', () => {
    const soul = makeSoul();
    const first = exportYAML(soul);
    const second = exportYAML(soul);
    expect(first).toBe(second);
  });

  it('output is human-readable with proper indentation', () => {
    const yaml = exportYAML(makeSoul());
    // Check that nested values are indented
    const lines = yaml.split('\n');
    const coreTruthsLine = lines.findIndex(l => l.includes('coreTruths:'));
    if (coreTruthsLine >= 0) {
      // The next line should be indented
      const nextLine = lines[coreTruthsLine + 1];
      expect(nextLine).toMatch(/^  \w/);
    }
  });
});
