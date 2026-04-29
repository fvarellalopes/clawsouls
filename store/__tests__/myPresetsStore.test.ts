import { useMyPresetsStore, MyPreset } from '../myPresetsStore';
import { SoulState } from '../soulStore';

// Mock crypto.randomUUID
const mockUUID = 'test-uuid-1234';
const originalRandomUUID = crypto.randomUUID;
beforeAll(() => {
  (crypto as any).randomUUID = jest.fn(() => mockUUID);
});
afterAll(() => {
  crypto.randomUUID = originalRandomUUID;
});

const makeSoul = (overrides: Record<string, any> = {}): SoulState['soul'] => ({
  name: 'TestBot',
  creature: 'AI',
  vibe: 'Friendly',
  emoji: '😊',
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
  ...overrides,
});

beforeEach(() => {
  useMyPresetsStore.setState({ presets: [] });
});

// ─── add ───
describe('myPresetsStore — add', () => {
  it('adds a preset with generated id and savedAt', () => {
    const soul = makeSoul({ name: 'MyBot' });
    useMyPresetsStore.getState().add({ name: 'My Preset', soul });

    const presets = useMyPresetsStore.getState().presets;
    expect(presets).toHaveLength(1);
    expect(presets[0].id).toBe(mockUUID);
    expect(presets[0].name).toBe('My Preset');
    expect(presets[0].soul.name).toBe('MyBot');
    expect(presets[0].savedAt).toBeGreaterThan(0);
  });

  it('adds multiple presets', () => {
    (crypto as any).randomUUID = jest.fn()
      .mockReturnValueOnce('uuid-1')
      .mockReturnValueOnce('uuid-2');

    useMyPresetsStore.getState().add({ name: 'First', soul: makeSoul({ name: 'A' }) });
    useMyPresetsStore.getState().add({ name: 'Second', soul: makeSoul({ name: 'B' }) });

    const presets = useMyPresetsStore.getState().presets;
    expect(presets).toHaveLength(2);
    expect(presets[0].id).toBe('uuid-1');
    expect(presets[1].id).toBe('uuid-2');
  });
});

// ─── remove ───
describe('myPresetsStore — remove', () => {
  it('removes a preset by id', () => {
    (crypto as any).randomUUID = jest.fn()
      .mockReturnValueOnce('id-1')
      .mockReturnValueOnce('id-2');

    useMyPresetsStore.getState().add({ name: 'First', soul: makeSoul() });
    useMyPresetsStore.getState().add({ name: 'Second', soul: makeSoul() });

    useMyPresetsStore.getState().remove('id-1');
    const presets = useMyPresetsStore.getState().presets;
    expect(presets).toHaveLength(1);
    expect(presets[0].id).toBe('id-2');
  });

  it('does nothing when removing a non-existent id', () => {
    useMyPresetsStore.getState().add({ name: 'Test', soul: makeSoul() });
    useMyPresetsStore.getState().remove('non-existent');
    expect(useMyPresetsStore.getState().presets).toHaveLength(1);
  });

  it('handles removing from empty presets', () => {
    useMyPresetsStore.getState().remove('anything');
    expect(useMyPresetsStore.getState().presets).toHaveLength(0);
  });
});

// ─── load ───
describe('myPresetsStore — load', () => {
  it('returns the soul for an existing preset', () => {
    (crypto as any).randomUUID = jest.fn(() => 'load-id');
    const soul = makeSoul({ name: 'Loaded' });
    useMyPresetsStore.getState().add({ name: 'Test', soul });

    const loaded = useMyPresetsStore.getState().load('load-id');
    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe('Loaded');
  });

  it('returns null for a non-existent preset', () => {
    const loaded = useMyPresetsStore.getState().load('non-existent');
    expect(loaded).toBeNull();
  });

  it('returns null when presets is empty', () => {
    const loaded = useMyPresetsStore.getState().load('any-id');
    expect(loaded).toBeNull();
  });
});

// ─── integration: add + load + remove ───
describe('myPresetsStore — integration', () => {
  it('full lifecycle: add, load, remove', () => {
    (crypto as any).randomUUID = jest.fn(() => 'lifecycle-id');
    const soul = makeSoul({ name: 'Lifecycle', humor: 90 });

    // Add
    useMyPresetsStore.getState().add({ name: 'My Preset', soul });
    expect(useMyPresetsStore.getState().presets).toHaveLength(1);

    // Load
    const loaded = useMyPresetsStore.getState().load('lifecycle-id');
    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe('Lifecycle');
    expect(loaded!.humor).toBe(90);

    // Remove
    useMyPresetsStore.getState().remove('lifecycle-id');
    expect(useMyPresetsStore.getState().presets).toHaveLength(0);
    expect(useMyPresetsStore.getState().load('lifecycle-id')).toBeNull();
  });
});
