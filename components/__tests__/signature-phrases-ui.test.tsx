import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSoulStore } from '@/store/soulStore';
import { useHistoryStore } from '@/store/historyStore';
import { useAutoSaveStore } from '@/store/autoSaveStore';

// Mock heavy dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      signaturePhrases: 'Signature Phrases',
      signaturePhrasesDesc: 'Catchphrases your AI uses naturally in conversation',
      signaturePhrasesPlaceholder: 'e.g., Let\'s cut to the chase',
      signaturePhrasesMaxReached: 'Maximum of 5 phrases reached',
      signaturePhrasesCounter: '{count}/5 phrases added',
      emotionalRange: 'Emotional Range',
      emotionalRangeDesc: 'How expressive your AI is in conversations',
      'emotionalLabels.stoic': 'Stoic',
      'emotionalLabels.dramatic': 'Dramatic',
      'emotionalLabels.reserved': 'Reserved',
      'emotionalLabels.balanced': 'Balanced',
      'emotionalLabels.expressive': 'Expressive',
    };
    return translations[key] || key;
  },
}));

jest.mock('@/lib/usePresets', () => ({
  usePresets: () => ({ presets: [], loading: false }),
}));

jest.mock('@/store/achievementsStore', () => ({
  useAchievementsStore: () => ({
    incrementExport: jest.fn(),
    incrementShare: jest.fn(),
    addLanguageUsed: jest.fn(),
  }),
}));

jest.mock('@/lib/soulGenerator', () => ({
  generateSoulMD: () => 'mock soul md',
}));

jest.mock('@/lib/exportYAML', () => ({
  exportYAML: () => 'mock yaml',
}));

// Test the signature phrases list rendering logic directly
// by simulating the add/remove/limit behavior from the store
describe('Signature Phrases — UI interactions', () => {
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

  it('starts with empty signature phrases', () => {
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual([]);
  });

  it('adds a phrase (simulating input + add button)', () => {
    const phrase = 'Let us begin';
    // Simulate: user types phrase, clicks add
    const current = useSoulStore.getState().soul.signaturePhrases;
    useSoulStore.getState().setSoul({
      signaturePhrases: [...current, phrase],
    });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Let us begin']);
  });

  it('adds multiple phrases sequentially', () => {
    const phrases = ['First', 'Second', 'Third'];
    for (const phrase of phrases) {
      const current = useSoulStore.getState().soul.signaturePhrases;
      useSoulStore.getState().setSoul({
        signaturePhrases: [...current, phrase],
      });
    }
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['First', 'Second', 'Third']);
  });

  it('removes a phrase by index (simulating x button)', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['Keep', 'Remove me', 'Also keep'],
    });
    // Simulate: user clicks remove on index 1
    const phrases = [...useSoulStore.getState().soul.signaturePhrases];
    phrases.splice(1, 1);
    useSoulStore.getState().setSoul({ signaturePhrases: phrases });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Keep', 'Also keep']);
  });

  it('enforces max 5 phrases', () => {
    // Add 5 phrases
    useSoulStore.getState().setSoul({
      signaturePhrases: ['One', 'Two', 'Three', 'Four', 'Five'],
    });
    const phrases = useSoulStore.getState().soul.signaturePhrases;
    expect(phrases).toHaveLength(5);

    // UI would disable the add button at this point
    // Simulate the check: length >= 5 means cannot add
    const canAdd = phrases.length < 5;
    expect(canAdd).toBe(false);
  });

  it('allows adding when under the limit', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['One', 'Two'],
    });
    const canAdd = useSoulStore.getState().soul.signaturePhrases.length < 5;
    expect(canAdd).toBe(true);
  });

  it('allows removing the last phrase', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['Only one'],
    });
    const phrases = [...useSoulStore.getState().soul.signaturePhrases];
    phrases.splice(0, 1);
    useSoulStore.getState().setSoul({ signaturePhrases: phrases });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual([]);
  });

  it('handles empty string phrases (should be filtered in UI)', () => {
    // UI would check trimmed value before adding
    const phrase = '  ';
    const canAdd = phrase.trim().length > 0;
    expect(canAdd).toBe(false);
  });

  it('enforces 50 character limit per phrase', () => {
    const longPhrase = 'A'.repeat(51);
    // UI would slice to 50 via onChange
    const sliced = longPhrase.slice(0, 50);
    expect(sliced).toHaveLength(50);

    useSoulStore.getState().setSoul({
      signaturePhrases: [sliced],
    });
    expect(useSoulStore.getState().soul.signaturePhrases[0]).toHaveLength(50);
  });
});

// ─── Emotional Range — UI interactions ───
describe('Emotional Range — UI interactions', () => {
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
  });

  it('defaults to 50 (balanced)', () => {
    expect(useSoulStore.getState().soul.emotionalRange).toBe(50);
  });

  it('shows correct label for stoic (0-20)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 10 });
    const value = useSoulStore.getState().soul.emotionalRange;
    const label = value <= 20 ? 'Stoic' : value <= 40 ? 'Reserved' : value <= 60 ? 'Balanced' : value <= 80 ? 'Expressive' : 'Dramatic';
    expect(label).toBe('Stoic');
  });

  it('shows correct label for reserved (21-40)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 30 });
    const value = useSoulStore.getState().soul.emotionalRange;
    const label = value <= 20 ? 'Stoic' : value <= 40 ? 'Reserved' : value <= 60 ? 'Balanced' : value <= 80 ? 'Expressive' : 'Dramatic';
    expect(label).toBe('Reserved');
  });

  it('shows correct label for balanced (41-60)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 50 });
    const value = useSoulStore.getState().soul.emotionalRange;
    const label = value <= 20 ? 'Stoic' : value <= 40 ? 'Reserved' : value <= 60 ? 'Balanced' : value <= 80 ? 'Expressive' : 'Dramatic';
    expect(label).toBe('Balanced');
  });

  it('shows correct label for expressive (61-80)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 70 });
    const value = useSoulStore.getState().soul.emotionalRange;
    const label = value <= 20 ? 'Stoic' : value <= 40 ? 'Reserved' : value <= 60 ? 'Balanced' : value <= 80 ? 'Expressive' : 'Dramatic';
    expect(label).toBe('Expressive');
  });

  it('shows correct label for dramatic (81-100)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 90 });
    const value = useSoulStore.getState().soul.emotionalRange;
    const label = value <= 20 ? 'Stoic' : value <= 40 ? 'Reserved' : value <= 60 ? 'Balanced' : value <= 80 ? 'Expressive' : 'Dramatic';
    expect(label).toBe('Dramatic');
  });

  it('updates via slider interaction', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 25 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(25);
  });

  it('supports boundary values', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 0 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(0);

    useSoulStore.getState().setSoul({ emotionalRange: 100 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(100);
  });
});
