import { create } from "zustand";

interface AutoSaveState {
  lastSaved: number | null;
  isSaving: boolean;
  setLastSaved: (timestamp: number) => void;
  setIsSaving: (saving: boolean) => void;
}

export const useAutoSaveStore = create<AutoSaveState>((set) => ({
  lastSaved: null,
  isSaving: false,
  setLastSaved: (timestamp) => set({ lastSaved: timestamp }),
  setIsSaving: (saving) => set({ isSaving: saving }),
}));
