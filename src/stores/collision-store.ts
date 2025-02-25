import { create } from "zustand";

const initialState = {
  checksPerformed: 0,
} as const;

type CollisionState = Readonly<{
  // State
  checksPerformed: number;

  // Actions
  addChecks: (checks: number) => void;
  resetChecks: () => void;
}>;

export const useCollisionStore = create<CollisionState>((set) => ({
  ...initialState,

  // Actions
  addChecks: (checks) =>
    set((state) => ({
      checksPerformed: state.checksPerformed + checks,
    })),
  resetChecks: () => set(initialState),
}));
