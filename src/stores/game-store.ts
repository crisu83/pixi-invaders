import { create } from "zustand";
import { GameEntity, GameState } from "../types";
import { createEntity } from "../utils/entity-factory";
import {
  STAGE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
} from "../constants";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  gameStarted: false,
  gameOver: false,
  player: createEntity("PLAYER", [0, stageHeight / 3]),
  enemies: [],
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
    set((state) => {
      const newEnemies: GameEntity[] = [];
      for (const row of Array.from({ length: ENEMY_ROWS }, (_, i) => i)) {
        for (const col of Array.from(
          { length: ENEMIES_PER_ROW },
          (_, i) => i
        )) {
          const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
          const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
          newEnemies.push(createEntity("ENEMY", [x, y]));
        }
      }
      return {
        ...state,
        enemies: newEnemies,
        gameStarted: true,
        gameOver: false,
        velocity: [0, 0],
        player: createEntity("PLAYER", [0, stageHeight / 3]),
      };
    }),

  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== id),
    })),

  updatePlayer: (player) => set({ player }),
}));
