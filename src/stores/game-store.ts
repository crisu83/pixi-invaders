import { create } from "zustand";
import { GameState } from "../types";

const initialState = {
  gameStarted: false,
  gameOver: false,
} as const;

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // Actions
  setGameStarted: (gameStarted) => set({ gameStarted }),
  setGameOver: (gameOver) => set({ gameOver }),

  // Game management
  initializeGame: () => set({ ...initialState, gameStarted: true }),
}));
