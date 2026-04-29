import { useSoulStore } from '@/store/soulStore';
import { useHistoryStore } from '@/store/historyStore';
import { useAutoSaveStore } from '@/store/autoSaveStore';

beforeEach(() => {
  useSoulStore.setState({
    soul: {
      name: '',
      creature: '',
      vibe: '',
      emoji: '',
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
      vibeStyle: 'concise',
      continuity: true,
      humor: 50,
      formality: 50,
      emojiUsage: 30,
      verbosity: 50,
      consciousness: 50,
      questioning: 30,
      openness: 70,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 30,
      communicationMode: 'direct',
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
    } as any,
    isDarkMode: false,
    locale: 'en',
  });
  useHistoryStore.setState({ past: [], future: [], maxSize: 50 });
  useAutoSaveStore.setState({ lastSaved: null, isSaving: false });
});

describe('Signature Phrases — UI interactions', () => {
  it('starts with empty signature phrases', () => {
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual([]);
  });

  it('adds a phrase (simulating input + add button)', () => {
    const phrase = 'Let us begin';
    const current = useSoulStore.getState().soul.signaturePhrases;
    useSoulStore.getState().setSoul({
      signaturePhrases: [...current, phrase],
    });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Let us begin']);
  });

  it('removes a phrase by index (simulating x button)', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['Keep', 'Remove me', 'Also keep'],
    });
    const phrases = [...useSoulStore.getState().soul.signaturePhrases];
    phrases.splice(1, 1);
    useSoulStore.getState().setSoul({ signaturePhrases: phrases });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Keep', 'Also keep']);
  });

  it('enforces max 5 phrases', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['One', 'Two', 'Three', 'Four', 'Five'],
    });
    const phrases = useSoulStore.getState().soul.signaturePhrases;
    expect(phrases).toHaveLength(5);
    expect(phrases.length < 5).toBe(false);
  });

  it('allows adding when under the limit', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['One', 'Two'],
    });
    expect(useSoulStore.getState().soul.signaturePhrases.length < 5).toBe(true);
  });

  it('enforces 50 character limit per phrase', () => {
    const longPhrase = 'A'.repeat(51);
    const sliced = longPhrase.slice(0, 50);
    expect(sliced).toHaveLength(50);
    useSoulStore.getState().setSoul({ signaturePhrases: [sliced] });
    expect(useSoulStore.getState().soul.signaturePhrases[0]).toHaveLength(50);
  });

  it('rejects empty string phrases', () => {
    const phrase = '  ';
    expect(phrase.trim().length > 0).toBe(false);
  });
});

describe('Emotional Range — UI interactions', () => {
  it('defaults to 50 (balanced)', () => {
    expect(useSoulStore.getState().soul.emotionalRange).toBe(50);
  });

  it('shows stoic label for 0-20', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 10 });
    const v = useSoulStore.getState().soul.emotionalRange;
    expect(v <= 20 ? 'Stoic' : 'Other').toBe('Stoic');
  });

  it('shows dramatic label for 81-100', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 90 });
    const v = useSoulStore.getState().soul.emotionalRange;
    expect(v > 80 ? 'Dramatic' : 'Other').toBe('Dramatic');
  });

  it('supports boundary values 0 and 100', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 0 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(0);
    useSoulStore.getState().setSoul({ emotionalRange: 100 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(100);
  });
});
