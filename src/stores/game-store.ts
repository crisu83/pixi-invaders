import { create } from "zustand";
import { GameState } from "../types";
import { createEntity } from "../utils/entity-factory";
import { STAGE_SIZE } from "../constants";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  gameStarted: false,
  gameOver: false,
  player: createEntity("PLAYER", [0, stageHeight / 3]),
  velocity: [0, 0] as [number, number],
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // Actions
  setGameStarted: (gameStarted) => set({ gameStarted }),
  setGameOver: (gameOver) => set({ gameOver }),
  setVelocity: (velocity) => set({ velocity }),

  // Entity management
  initializeGame: () =>
    set((state) => ({
      ...state,
      gameStarted: true,
      gameOver: false,
      velocity: [0, 0],
      player: createEntity("PLAYER", [0, stageHeight / 3]),
    })),

  updatePlayer: (player) => set({ player }),
}));
