import { useSoulStore, SoulPreset } from '../soulStore';
import { useHistoryStore } from '../historyStore';
import { useAutoSaveStore } from '../autoSaveStore';

// Reset stores before each test
beforeEach(() => {
  // Reset soulStore to defaults
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

  // Reset dependent stores
  useHistoryStore.setState({ past: [], future: [], maxSize: 50 });
  useAutoSaveStore.setState({ lastSaved: null, isSaving: false });
});

// ─── setSoul ───
describe('soulStore — setSoul', () => {
  it('merges partial soul updates into existing state', () => {
    useSoulStore.getState().setSoul({ name: 'Aria' });
    expect(useSoulStore.getState().soul.name).toBe('Aria');
    // Other fields should remain unchanged
    expect(useSoulStore.getState().soul.creature).toBe('');
    expect(useSoulStore.getState().soul.humor).toBe(50);
  });

  it('updates multiple fields at once', () => {
    useSoulStore.getState().setSoul({
      name: 'Nova',
      creature: 'Phoenix',
      humor: 80,
      formality: 20,
    });
    const soul = useSoulStore.getState().soul;
    expect(soul.name).toBe('Nova');
    expect(soul.creature).toBe('Phoenix');
    expect(soul.humor).toBe(80);
    expect(soul.formality).toBe(20);
  });

  it('preserves existing fields not included in update', () => {
    useSoulStore.getState().setSoul({ emoji: '🔥' });
    const soul = useSoulStore.getState().soul;
    expect(soul.emoji).toBe('🔥');
    expect(soul.vibeStyle).toBe('concise');
    expect(soul.continuity).toBe(true);
  });

  it('triggers history push via setTimeout', async () => {
    useSoulStore.getState().setSoul({ name: 'Test' });
    // The setSoul pushes to history after 100ms
    await new Promise((r) => setTimeout(r, 200));
    expect(useHistoryStore.getState().past.length).toBeGreaterThan(0);
  });

  it('triggers auto-save lifecycle via setTimeout', async () => {
    useSoulStore.getState().setSoul({ name: 'Test' });
    // isSaving should become true after ~200ms
    await new Promise((r) => setTimeout(r, 300));
    expect(useAutoSaveStore.getState().isSaving).toBe(true);

    // Should finish saving after ~700ms total
    await new Promise((r) => setTimeout(r, 400));
    expect(useAutoSaveStore.getState().isSaving).toBe(false);
    expect(useAutoSaveStore.getState().lastSaved).not.toBeNull();
  });
});

// ─── resetSoul ───
describe('soulStore — resetSoul', () => {
  it('resets soul to default values', () => {
    useSoulStore.getState().setSoul({ name: 'Aria', humor: 90 });
    useSoulStore.getState().resetSoul();
    const soul = useSoulStore.getState().soul;
    expect(soul.name).toBe('');
    expect(soul.humor).toBe(50);
    expect(soul.communicationMode).toBe('direct');
  });

  it('pushes the reset state to history', () => {
    useSoulStore.getState().setSoul({ name: 'Aria' });
    useSoulStore.getState().resetSoul();
    expect(useHistoryStore.getState().past.length).toBeGreaterThan(0);
  });
});

// ─── loadPreset ───
describe('soulStore — loadPreset', () => {
  const makePreset = (overrides: Partial<SoulPreset> = {}): SoulPreset => ({
    id: 'test-preset',
    name: 'TestPreset',
    creature: 'Bot',
    vibe: 'Helpful',
    emoji: '🤖',
    coreTruths: {
      helpful: true,
      opinions: false,
      resourceful: true,
      trustworthy: false,
      respectful: true,
    },
    boundaries: {
      private: true,
      askBeforeActing: false,
      noHalfBaked: true,
      notVoiceProxy: false,
    },
    vibeStyle: 'expressive',
    description: 'A test preset',
    tags: ['test'],
    source: 'character',
    ...overrides,
  });

  it('loads a full preset correctly', () => {
    const preset = makePreset({
      name: 'Aria',
      creature: 'Digital Phoenix',
      emoji: '🔥',
      humor: 85,
      formality: 15,
    });
    useSoulStore.getState().loadPreset(preset);
    const soul = useSoulStore.getState().soul;
    expect(soul.name).toBe('Aria');
    expect(soul.creature).toBe('Digital Phoenix');
    expect(soul.emoji).toBe('🔥');
    expect(soul.humor).toBe(85);
    expect(soul.formality).toBe(15);
    expect(soul.vibeStyle).toBe('expressive');
  });

  it('applies default values for optional fields when not provided', () => {
    const preset = makePreset(); // no optional fields set
    useSoulStore.getState().loadPreset(preset);
    const soul = useSoulStore.getState().soul;
    expect(soul.humor).toBe(50);
    expect(soul.formality).toBe(50);
    expect(soul.emojiUsage).toBe(30);
    expect(soul.verbosity).toBe(50);
    expect(soul.consciousness).toBe(50);
    expect(soul.questioning).toBe(30);
    expect(soul.openness).toBe(70);
    expect(soul.conscientiousness).toBe(50);
    expect(soul.extraversion).toBe(50);
    expect(soul.agreeableness).toBe(50);
    expect(soul.neuroticism).toBe(30);
    expect(soul.communicationMode).toBe('direct');
    expect(soul.emotionalRange).toBe(50);
  });

  it('applies default speechPatterns when not provided', () => {
    const preset = makePreset();
    useSoulStore.getState().loadPreset(preset);
    const sp = useSoulStore.getState().soul.speechPatterns;
    expect(sp.alliteration).toBe(false);
    expect(sp.rhymeTendency).toBe(10);
    expect(sp.metaphorFrequency).toBe(30);
    expect(sp.technicalJargon).toBe(40);
    expect(sp.slangUsage).toBe(20);
  });

  it('loads partial speechPatterns correctly', () => {
    const preset = makePreset({
      speechPatterns: { alliteration: true, technicalJargon: 80 },
    });
    useSoulStore.getState().loadPreset(preset);
    const sp = useSoulStore.getState().soul.speechPatterns;
    expect(sp.alliteration).toBe(true);
    expect(sp.technicalJargon).toBe(80);
    // Defaults for unspecified
    expect(sp.rhymeTendency).toBe(10);
    expect(sp.metaphorFrequency).toBe(30);
  });

  it('defaults customCoreTruths and customBoundaries to empty arrays', () => {
    const preset = makePreset();
    useSoulStore.getState().loadPreset(preset);
    expect(useSoulStore.getState().soul.customCoreTruths).toEqual([]);
    expect(useSoulStore.getState().soul.customBoundaries).toEqual([]);
  });

  it('loads custom core truths and boundaries from preset', () => {
    const preset = makePreset({
      customCoreTruths: ['Always think critically'],
      customBoundaries: ['Never share secrets'],
    });
    useSoulStore.getState().loadPreset(preset);
    expect(useSoulStore.getState().soul.customCoreTruths).toEqual(['Always think critically']);
    expect(useSoulStore.getState().soul.customBoundaries).toEqual(['Never share secrets']);
  });

  it('pushes the loaded state to history', () => {
    useSoulStore.getState().loadPreset(makePreset());
    // loadPreset pushes directly (no setTimeout)
    expect(useHistoryStore.getState().past.length).toBeGreaterThan(0);
  });
});

// ─── importSoul ───
describe('soulStore — importSoul', () => {
  it('imports valid JSON with all fields', () => {
    const json = JSON.stringify({
      name: 'Imported',
      creature: 'Bot',
      vibe: 'Calm',
      emoji: '🌿',
      humor: 60,
    });
    const result = useSoulStore.getState().importSoul(json);
    expect(result.success).toBe(true);
    expect(useSoulStore.getState().soul.name).toBe('Imported');
    expect(useSoulStore.getState().soul.humor).toBe(60);
  });

  it('returns error for invalid JSON', () => {
    const result = useSoulStore.getState().importSoul('not json');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid JSON format');
  });

  it('returns error when neither name nor creature is provided', () => {
    const json = JSON.stringify({ vibe: 'test' });
    const result = useSoulStore.getState().importSoul(json);
    expect(result.success).toBe(false);
    expect(result.error).toContain('name');
    expect(result.error).toContain('creature');
  });

  it('accepts JSON with only name', () => {
    const json = JSON.stringify({ name: 'Solo' });
    const result = useSoulStore.getState().importSoul(json);
    expect(result.success).toBe(true);
    expect(useSoulStore.getState().soul.name).toBe('Solo');
  });

  it('accepts JSON with only creature', () => {
    const json = JSON.stringify({ creature: 'Phoenix' });
    const result = useSoulStore.getState().importSoul(json);
    expect(result.success).toBe(true);
    expect(useSoulStore.getState().soul.creature).toBe('Phoenix');
  });

  it('applies defaults for missing optional fields', () => {
    const json = JSON.stringify({ name: 'Minimal' });
    useSoulStore.getState().importSoul(json);
    const soul = useSoulStore.getState().soul;
    expect(soul.humor).toBe(50);
    expect(soul.vibeStyle).toBe('concise');
    expect(soul.communicationMode).toBe('direct');
    expect(soul.customCoreTruths).toEqual([]);
    expect(soul.customBoundaries).toEqual([]);
    expect(soul.knowledgeDomains).toEqual([]);
  });

  it('handles non-array customCoreTruths gracefully', () => {
    const json = JSON.stringify({ name: 'Test', customCoreTruths: 'not-array' });
    useSoulStore.getState().importSoul(json);
    expect(useSoulStore.getState().soul.customCoreTruths).toEqual([]);
  });
});

// ─── setIsDarkMode / setLocale ───
describe('soulStore — UI state', () => {
  it('toggles dark mode', () => {
    expect(useSoulStore.getState().isDarkMode).toBe(false);
    useSoulStore.getState().setIsDarkMode(true);
    expect(useSoulStore.getState().isDarkMode).toBe(true);
  });

  it('changes locale', () => {
    expect(useSoulStore.getState().locale).toBe('en');
    useSoulStore.getState().setLocale('zh');
    expect(useSoulStore.getState().locale).toBe('zh');
  });
});

// ─── canUndo / canRedo ───
describe('soulStore — canUndo / canRedo delegation', () => {
  it('canUndo delegates to historyStore', () => {
    expect(useSoulStore.getState().canUndo()).toBe(false);
    useHistoryStore.getState().push(useSoulStore.getState().soul);
    expect(useSoulStore.getState().canUndo()).toBe(true);
  });

  it('canRedo delegates to historyStore', () => {
    expect(useSoulStore.getState().canRedo()).toBe(false);
  });
});
