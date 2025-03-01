import { create } from "zustand";

type DebugStore = Readonly<{
  // State
  showStats: boolean;

  // Actions
  toggleStats: () => void;
}>;

export const useDebugStore = create<DebugStore>((set) => ({
  showStats: false,

  toggleStats: () => {
    set((state) => ({ showStats: !state.showStats }));
  },
}));
