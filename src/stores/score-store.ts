import { create } from "zustand";

type ScoreState = Readonly<{
  // State
  score: number;
  combo: number;
  lastKillTime: number;

  // Actions
  addScore: (points: number) => void;
  resetScore: () => void;
}>;

export const useScoreStore = create<ScoreState>((set) => ({
  // Initial state
  score: 0,
  combo: 0,
  lastKillTime: 0,

  // Actions
  addScore: (points) =>
    set((state) => {
      const now = performance.now();
      const timeSinceLastKill = now - state.lastKillTime;
      const newCombo = timeSinceLastKill < 1000 ? state.combo + 1 : 1;
      const multiplier = Math.min(4, 1 + (newCombo - 1) * 0.5);

      return {
        score: state.score + points * multiplier,
        combo: newCombo,
        lastKillTime: now,
      };
    }),

  resetScore: () =>
    set({
      score: 0,
      combo: 0,
      lastKillTime: 0,
    }),
}));
