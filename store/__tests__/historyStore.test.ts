import { useHistoryStore } from '../historyStore';
import { SoulState } from '../soulStore';

// ─── Helpers ───
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

// Reset store between tests
beforeEach(() => {
  useHistoryStore.setState({ past: [], future: [], maxSize: 50 });
});

// ─── push ───
describe('historyStore — push', () => {
  it('adds a soul state to the past array', () => {
    const soul = makeSoul({ name: 'First' });
    useHistoryStore.getState().push(soul);
    expect(useHistoryStore.getState().past).toHaveLength(1);
    expect(useHistoryStore.getState().past[0].name).toBe('First');
  });

  it('clears future on push', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul({ name: 'A' }));
    store.push(makeSoul({ name: 'B' }));
    // Simulate undo to populate future
    store.undo(makeSoul({ name: 'Current' }));
    expect(useHistoryStore.getState().future.length).toBeGreaterThan(0);

    // Push should clear future
    store.push(makeSoul({ name: 'C' }));
    expect(useHistoryStore.getState().future).toHaveLength(0);
  });

  it('appends multiple pushes in order', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul({ name: 'A' }));
    store.push(makeSoul({ name: 'B' }));
    store.push(makeSoul({ name: 'C' }));
    expect(useHistoryStore.getState().past).toHaveLength(3);
    expect(useHistoryStore.getState().past[0].name).toBe('A');
    expect(useHistoryStore.getState().past[1].name).toBe('B');
    expect(useHistoryStore.getState().past[2].name).toBe('C');
  });
});

// ─── maxSize ───
describe('historyStore — maxSize', () => {
  it('trims past when exceeding maxSize', () => {
    const store = useHistoryStore.getState();
    useHistoryStore.setState({ maxSize: 3 });

    store.push(makeSoul({ name: '1' }));
    store.push(makeSoul({ name: '2' }));
    store.push(makeSoul({ name: '3' }));
    store.push(makeSoul({ name: '4' }));

    const past = useHistoryStore.getState().past;
    expect(past).toHaveLength(3);
    // Oldest entry should be removed
    expect(past[0].name).toBe('2');
    expect(past[1].name).toBe('3');
    expect(past[2].name).toBe('4');
  });

  it('respects custom maxSize', () => {
    useHistoryStore.setState({ maxSize: 2 });
    const store = useHistoryStore.getState();

    store.push(makeSoul({ name: 'A' }));
    store.push(makeSoul({ name: 'B' }));
    store.push(makeSoul({ name: 'C' }));

    expect(useHistoryStore.getState().past).toHaveLength(2);
    expect(useHistoryStore.getState().past[0].name).toBe('B');
  });
});

// ─── undo ───
describe('historyStore — undo', () => {
  it('returns the last past entry and moves current to future', () => {
    const store = useHistoryStore.getState();
    const soulA = makeSoul({ name: 'A' });
    const soulB = makeSoul({ name: 'B' });
    const current = makeSoul({ name: 'Current' });

    store.push(soulA);
    store.push(soulB);

    const previous = store.undo(current);
    expect(previous.name).toBe('B');
    expect(useHistoryStore.getState().past).toHaveLength(1);
    expect(useHistoryStore.getState().future).toHaveLength(1);
    expect(useHistoryStore.getState().future[0].name).toBe('Current');
  });

  it('returns current state when past is empty', () => {
    const current = makeSoul({ name: 'Current' });
    const result = useHistoryStore.getState().undo(current);
    expect(result.name).toBe('Current');
    expect(useHistoryStore.getState().future).toHaveLength(0);
  });

  it('supports multiple undos', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul({ name: 'A' }));
    store.push(makeSoul({ name: 'B' }));
    store.push(makeSoul({ name: 'C' }));

    const first = store.undo(makeSoul({ name: 'Current' }));
    expect(first.name).toBe('C');

    const second = store.undo(makeSoul({ name: 'Current2' }));
    expect(second.name).toBe('B');

    expect(useHistoryStore.getState().past).toHaveLength(1);
    expect(useHistoryStore.getState().future).toHaveLength(2);
  });
});

// ─── redo ───
describe('historyStore — redo', () => {
  it('returns the first future entry and moves current to past', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul({ name: 'A' }));

    // Undo to populate future
    store.undo(makeSoul({ name: 'Current' }));
    expect(useHistoryStore.getState().future).toHaveLength(1);

    // Redo
    const next = store.redo(makeSoul({ name: 'RedoCurrent' }));
    expect(next.name).toBe('Current');
    expect(useHistoryStore.getState().future).toHaveLength(0);
    expect(useHistoryStore.getState().past.length).toBeGreaterThan(0);
  });

  it('returns current state when future is empty', () => {
    const current = makeSoul({ name: 'Current' });
    const result = useHistoryStore.getState().redo(current);
    expect(result.name).toBe('Current');
  });

  it('supports multiple redos', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul({ name: 'A' }));
    store.push(makeSoul({ name: 'B' }));
    store.push(makeSoul({ name: 'C' }));

    // Undo twice
    store.undo(makeSoul({ name: 'X' }));
    store.undo(makeSoul({ name: 'Y' }));
    expect(useHistoryStore.getState().future).toHaveLength(2);

    // Redo twice — future contains [Y, X] (the "current" values passed to undo)
    const first = store.redo(makeSoul({ name: 'R1' }));
    const second = store.redo(makeSoul({ name: 'R2' }));
    expect(first.name).toBe('Y');
    expect(second.name).toBe('X');
    expect(useHistoryStore.getState().future).toHaveLength(0);
  });
});

// ─── canUndo / canRedo ───
describe('historyStore — canUndo / canRedo', () => {
  it('canUndo returns false when past is empty', () => {
    expect(useHistoryStore.getState().canUndo()).toBe(false);
  });

  it('canUndo returns true when past has entries', () => {
    useHistoryStore.getState().push(makeSoul());
    expect(useHistoryStore.getState().canUndo()).toBe(true);
  });

  it('canRedo returns false when future is empty', () => {
    expect(useHistoryStore.getState().canRedo()).toBe(false);
  });

  it('canRedo returns true after undo', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul());
    store.undo(makeSoul());
    expect(useHistoryStore.getState().canRedo()).toBe(true);
  });
});

// ─── clear ───
describe('historyStore — clear', () => {
  it('clears both past and future', () => {
    const store = useHistoryStore.getState();
    store.push(makeSoul({ name: 'A' }));
    store.push(makeSoul({ name: 'B' }));
    store.undo(makeSoul({ name: 'X' }));

    expect(useHistoryStore.getState().past.length).toBeGreaterThan(0);
    expect(useHistoryStore.getState().future.length).toBeGreaterThan(0);

    store.clear();
    expect(useHistoryStore.getState().past).toHaveLength(0);
    expect(useHistoryStore.getState().future).toHaveLength(0);
  });
});

// ─── undo/redo integration ───
describe('historyStore — undo/redo round-trip', () => {
  it('preserves state through undo then redo', () => {
    const store = useHistoryStore.getState();
    const soulA = makeSoul({ name: 'Original', humor: 30 });
    const soulB = makeSoul({ name: 'Modified', humor: 80 });

    store.push(soulA);
    store.push(soulB);

    // Undo should return soulB (the last pushed before "current")
    const undone = store.undo(makeSoul({ name: 'Current' }));
    expect(undone.name).toBe('Modified');

    // Redo should return the "current" we passed to undo
    const redone = store.redo(makeSoul({ name: 'AfterRedo' }));
    expect(redone.name).toBe('Current');
  });
});
