import { create } from "zustand";

const initialState = {
  gameStarted: false,
  gameOver: false,
} as const;

type GameState = Readonly<{
  // State
  gameStarted: boolean;
  gameOver: boolean;

  // Actions
  endGame: () => void;
  startGame: () => void;
}>;

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // Actions
  endGame: () =>
    set({
      ...initialState,
      gameOver: true,
    }),
  startGame: () =>
    set({
      ...initialState,
      gameStarted: true,
    }),
}));
