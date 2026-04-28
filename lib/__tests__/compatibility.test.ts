import { calculateCompatibility, findMostCompatible } from '../compatibility';

// ─── Helpers ───
const makeSoul = (overrides: Record<string, any> = {}) => ({
  name: "TestBot",
  creature: "AI",
  vibe: "Friendly",
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
  ...overrides,
});

// ─── calculateCompatibility ───
describe('calculateCompatibility', () => {
  it('returns 100% for identical souls', () => {
    const soul = makeSoul();
    const result = calculateCompatibility(soul, soul);
    expect(result.overall).toBe(100);
    expect(result.breakdown.tone).toBe(100);
    expect(result.breakdown.personality).toBe(100);
    expect(result.breakdown.style).toBe(100);
  });

  it('returns high score for nearly identical souls', () => {
    const a = makeSoul({ humor: 50, formality: 50 });
    const b = makeSoul({ humor: 52, formality: 48 });
    const result = calculateCompatibility(a, b);
    expect(result.overall).toBeGreaterThanOrEqual(90);
  });

  it('returns low score for completely different souls', () => {
    const a = makeSoul({
      vibeStyle: "concise",
      humor: 0, formality: 0, emojiUsage: 0, verbosity: 0, consciousness: 0, questioning: 0,
      openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0,
      coreTruths: { helpful: false, opinions: false, resourceful: false, trustworthy: false, respectful: false },
    });
    const b = makeSoul({
      vibeStyle: "dramatic",
      humor: 100, formality: 100, emojiUsage: 100, verbosity: 100, consciousness: 100, questioning: 100,
      openness: 100, conscientiousness: 100, extraversion: 100, agreeableness: 100, neuroticism: 100,
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
    });
    const result = calculateCompatibility(a, b);
    expect(result.overall).toBeLessThan(30);
  });

  it('returns mid-range score for partially overlapping souls', () => {
    const a = makeSoul({
      vibeStyle: "concise",
      humor: 10, formality: 90, emojiUsage: 10, verbosity: 10, consciousness: 90, questioning: 10,
      openness: 20, conscientiousness: 90, extraversion: 20, agreeableness: 20, neuroticism: 90,
      coreTruths: { helpful: true, opinions: false, resourceful: false, trustworthy: false, respectful: false },
    });
    const b = makeSoul({
      vibeStyle: "dramatic",
      humor: 80, formality: 20, emojiUsage: 80, verbosity: 80, consciousness: 20, questioning: 80,
      openness: 80, conscientiousness: 20, extraversion: 80, agreeableness: 80, neuroticism: 20,
      coreTruths: { helpful: false, opinions: true, resourceful: true, trustworthy: true, respectful: true },
    });
    const result = calculateCompatibility(a, b);
    expect(result.overall).toBeGreaterThan(10);
    expect(result.overall).toBeLessThan(50);
  });

  it('gives style match 100 when vibeStyles match', () => {
    const a = makeSoul({ vibeStyle: "expressive" });
    const b = makeSoul({ vibeStyle: "expressive" });
    const result = calculateCompatibility(a, b);
    expect(result.breakdown.style).toBe(100);
  });

  it('gives style match 0 when vibeStyles differ', () => {
    const a = makeSoul({ vibeStyle: "concise" });
    const b = makeSoul({ vibeStyle: "verbose" });
    const result = calculateCompatibility(a, b);
    expect(result.breakdown.style).toBe(0);
  });

  it('clamps overall score between 0 and 100', () => {
    const a = makeSoul();
    const b = makeSoul();
    const result = calculateCompatibility(a, b);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it('returns topSimilar and topDifferent arrays', () => {
    const a = makeSoul({ humor: 50, openness: 80 });
    const b = makeSoul({ humor: 50, openness: 20 });
    const result = calculateCompatibility(a, b);
    expect(result.topSimilar).toBeInstanceOf(Array);
    expect(result.topSimilar.length).toBeLessThanOrEqual(3);
    expect(result.topDifferent).toBeInstanceOf(Array);
    expect(result.topDifferent.length).toBeLessThanOrEqual(3);
  });

  it('handles missing optional fields gracefully', () => {
    const a = makeSoul();
    const b = {
      name: "Preset",
      creature: "Bot",
      vibe: "Neutral",
      emoji: "🤖",
      coreTruths: { helpful: true, opinions: false, resourceful: false, trustworthy: false, respectful: false },
      boundaries: { private: false, askBeforeActing: false, noHalfBaked: false, notVoiceProxy: false },
      vibeStyle: "balanced",
    };
    const result = calculateCompatibility(a, b);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it('accounts for core truths overlap in scoring', () => {
    const sharedTruths = makeSoul({
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
    });
    const noTruths = makeSoul({
      coreTruths: { helpful: false, opinions: false, resourceful: false, trustworthy: false, respectful: false },
    });
    const allTruths = makeSoul({
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
    });
    const sameResult = calculateCompatibility(sharedTruths, allTruths);
    const diffResult = calculateCompatibility(noTruths, allTruths);
    expect(sameResult.overall).toBeGreaterThanOrEqual(diffResult.overall);
  });
});

// ─── findMostCompatible ───
describe('findMostCompatible', () => {
  const presetA = makeSoul({
    id: "a",
    name: "Concise Bot",
    description: "Short and sweet",
    tags: ["concise"],
    source: "custom" as const,
    vibeStyle: "concise",
    humor: 30,
  });

  const presetB = makeSoul({
    id: "b",
    name: "Dramatic Bot",
    description: "Go big or go home",
    tags: ["dramatic"],
    source: "custom" as const,
    vibeStyle: "dramatic",
    humor: 90,
  });

  const presetC = makeSoul({
    id: "c",
    name: "Balanced Bot",
    description: "Middle ground",
    tags: ["balanced"],
    source: "custom" as const,
    vibeStyle: "balanced",
    humor: 50,
  });

  it('returns null for empty presets array', () => {
    const soul = makeSoul();
    const result = findMostCompatible(soul, []);
    expect(result).toBeNull();
  });

  it('finds the most compatible preset', () => {
    const soul = makeSoul({ vibeStyle: "concise", humor: 30 });
    const result = findMostCompatible(soul, [presetA, presetB, presetC]);
    expect(result).not.toBeNull();
    expect(result!.preset.name).toBe("Concise Bot");
  });

  it('returns compatibility details with the best match', () => {
    const soul = makeSoul({ vibeStyle: "dramatic", humor: 90 });
    const result = findMostCompatible(soul, [presetA, presetB, presetC]);
    expect(result).not.toBeNull();
    expect(result!.compatibility).toBeDefined();
    expect(result!.compatibility.overall).toBeGreaterThanOrEqual(0);
    expect(result!.preset.name).toBe("Dramatic Bot");
  });

  it('works with a single preset', () => {
    const soul = makeSoul();
    const result = findMostCompatible(soul, [presetA]);
    expect(result).not.toBeNull();
    expect(result!.preset.name).toBe("Concise Bot");
  });
});
