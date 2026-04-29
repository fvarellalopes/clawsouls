import { useSoulStore, SoulPreset } from '../soulStore';
import { useHistoryStore } from '../historyStore';
import { useAutoSaveStore } from '../autoSaveStore';

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
    },
    isDarkMode: false,
    locale: 'en',
  });
  useHistoryStore.setState({ past: [], future: [], maxSize: 50 });
  useAutoSaveStore.setState({ lastSaved: null, isSaving: false });
});

describe('soulStore — signaturePhrases', () => {
  it('defaults to empty array', () => {
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual([]);
  });

  it('adds a phrase via setSoul', () => {
    useSoulStore.getState().setSoul({ signaturePhrases: ['Let us begin'] });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Let us begin']);
  });

  it('adds multiple phrases via setSoul', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['Hello there', 'Cut to the chase', 'Onwards!'],
    });
    expect(useSoulStore.getState().soul.signaturePhrases).toHaveLength(3);
  });

  it('removes a phrase by index', () => {
    useSoulStore.getState().setSoul({
      signaturePhrases: ['Alpha', 'Beta', 'Gamma'],
    });
    const phrases = [...useSoulStore.getState().soul.signaturePhrases];
    phrases.splice(1, 1);
    useSoulStore.getState().setSoul({ signaturePhrases: phrases });
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Alpha', 'Gamma']);
  });

  it('supports up to 5 phrases (the UI max)', () => {
    const phrases = ['One', 'Two', 'Three', 'Four', 'Five'];
    useSoulStore.getState().setSoul({ signaturePhrases: phrases });
    expect(useSoulStore.getState().soul.signaturePhrases).toHaveLength(5);
  });

  it('persists through loadPreset', () => {
    const preset: SoulPreset = {
      id: 'test',
      name: 'Test',
      creature: 'Bot',
      vibe: 'Helpful',
      emoji: '🤖',
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
      boundaries: { private: true, askBeforeActing: true, noHalfBaked: true, notVoiceProxy: true },
      vibeStyle: 'concise',
      description: 'Test',
      tags: [],
      source: 'character',
      signaturePhrases: ['My catchphrase', 'Another one'],
    };
    useSoulStore.getState().loadPreset(preset);
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['My catchphrase', 'Another one']);
  });

  it('defaults to empty array when preset has no signaturePhrases', () => {
    const preset: SoulPreset = {
      id: 'test',
      name: 'Test',
      creature: 'Bot',
      vibe: 'Helpful',
      emoji: '🤖',
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
      boundaries: { private: true, askBeforeActing: true, noHalfBaked: true, notVoiceProxy: true },
      vibeStyle: 'concise',
      description: 'Test',
      tags: [],
      source: 'character',
    };
    useSoulStore.getState().loadPreset(preset);
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual([]);
  });

  it('persists through importSoul', () => {
    const json = JSON.stringify({ name: 'Imported', signaturePhrases: ['Imported phrase'] });
    useSoulStore.getState().importSoul(json);
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual(['Imported phrase']);
  });

  it('resets to empty array on resetSoul', () => {
    useSoulStore.getState().setSoul({ signaturePhrases: ['Will be gone'] });
    useSoulStore.getState().resetSoul();
    expect(useSoulStore.getState().soul.signaturePhrases).toEqual([]);
  });
});

describe('soulStore — emotionalRange', () => {
  it('defaults to 50', () => {
    expect(useSoulStore.getState().soul.emotionalRange).toBe(50);
  });

  it('updates via setSoul', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 80 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(80);
  });

  it('supports 0 (stoic)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 0 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(0);
  });

  it('supports 100 (dramatic)', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 100 });
    expect(useSoulStore.getState().soul.emotionalRange).toBe(100);
  });

  it('persists through loadPreset', () => {
    const preset: SoulPreset = {
      id: 'test',
      name: 'Test',
      creature: 'Bot',
      vibe: 'Helpful',
      emoji: '🤖',
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
      boundaries: { private: true, askBeforeActing: true, noHalfBaked: true, notVoiceProxy: true },
      vibeStyle: 'concise',
      description: 'Test',
      tags: [],
      source: 'character',
      emotionalRange: 75,
    };
    useSoulStore.getState().loadPreset(preset);
    expect(useSoulStore.getState().soul.emotionalRange).toBe(75);
  });

  it('defaults to 50 when preset has no emotionalRange', () => {
    const preset: SoulPreset = {
      id: 'test',
      name: 'Test',
      creature: 'Bot',
      vibe: 'Helpful',
      emoji: '🤖',
      coreTruths: { helpful: true, opinions: true, resourceful: true, trustworthy: true, respectful: true },
      boundaries: { private: true, askBeforeActing: true, noHalfBaked: true, notVoiceProxy: true },
      vibeStyle: 'concise',
      description: 'Test',
      tags: [],
      source: 'character',
    };
    useSoulStore.getState().loadPreset(preset);
    expect(useSoulStore.getState().soul.emotionalRange).toBe(50);
  });

  it('persists through importSoul', () => {
    const json = JSON.stringify({ name: 'Test', emotionalRange: 90 });
    useSoulStore.getState().importSoul(json);
    expect(useSoulStore.getState().soul.emotionalRange).toBe(90);
  });

  it('resets to 50 on resetSoul', () => {
    useSoulStore.getState().setSoul({ emotionalRange: 95 });
    useSoulStore.getState().resetSoul();
    expect(useSoulStore.getState().soul.emotionalRange).toBe(50);
  });
});
