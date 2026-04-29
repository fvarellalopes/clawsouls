import { useAutoSaveStore } from '../autoSaveStore';

beforeEach(() => {
  useAutoSaveStore.setState({ lastSaved: null, isSaving: false });
});

describe('autoSaveStore — initial state', () => {
  it('starts with lastSaved as null', () => {
    expect(useAutoSaveStore.getState().lastSaved).toBeNull();
  });

  it('starts with isSaving as false', () => {
    expect(useAutoSaveStore.getState().isSaving).toBe(false);
  });
});

describe('autoSaveStore — setLastSaved', () => {
  it('updates lastSaved to a timestamp', () => {
    const now = Date.now();
    useAutoSaveStore.getState().setLastSaved(now);
    expect(useAutoSaveStore.getState().lastSaved).toBe(now);
  });

  it('overwrites previous lastSaved value', () => {
    useAutoSaveStore.getState().setLastSaved(1000);
    useAutoSaveStore.getState().setLastSaved(2000);
    expect(useAutoSaveStore.getState().lastSaved).toBe(2000);
  });

  it('accepts 0 as a valid timestamp', () => {
    useAutoSaveStore.getState().setLastSaved(0);
    expect(useAutoSaveStore.getState().lastSaved).toBe(0);
  });
});

describe('autoSaveStore — setIsSaving', () => {
  it('sets isSaving to true', () => {
    useAutoSaveStore.getState().setIsSaving(true);
    expect(useAutoSaveStore.getState().isSaving).toBe(true);
  });

  it('sets isSaving back to false', () => {
    useAutoSaveStore.getState().setIsSaving(true);
    useAutoSaveStore.getState().setIsSaving(false);
    expect(useAutoSaveStore.getState().isSaving).toBe(false);
  });
});

describe('autoSaveStore — save lifecycle', () => {
  it('tracks a complete save cycle: start → finish', () => {
    const store = useAutoSaveStore.getState();

    // Start saving
    store.setIsSaving(true);
    expect(useAutoSaveStore.getState().isSaving).toBe(true);
    expect(useAutoSaveStore.getState().lastSaved).toBeNull();

    // Finish saving
    const now = Date.now();
    store.setLastSaved(now);
    store.setIsSaving(false);

    expect(useAutoSaveStore.getState().isSaving).toBe(false);
    expect(useAutoSaveStore.getState().lastSaved).toBe(now);
  });

  it('supports multiple save cycles', () => {
    const store = useAutoSaveStore.getState();

    store.setIsSaving(true);
    store.setLastSaved(1000);
    store.setIsSaving(false);

    store.setIsSaving(true);
    store.setLastSaved(2000);
    store.setIsSaving(false);

    expect(useAutoSaveStore.getState().lastSaved).toBe(2000);
    expect(useAutoSaveStore.getState().isSaving).toBe(false);
  });
});
