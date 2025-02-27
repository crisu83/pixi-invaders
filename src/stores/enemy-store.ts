import { create } from "zustand";
import {
  ENEMIES_PER_ROW,
  ENEMY_ROWS,
  ENEMY_SPACING,
  STAGE_SIZE,
} from "../constants";
import { GameEntity } from "../types";
import { createEntity } from "../utils/entity-factory";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  enemies: [] as GameEntity[],
} as const;

type EnemyState = Readonly<{
  // State
  enemies: GameEntity[];

  // Actions
  removeEnemy: (id: number) => void;
  resetEnemies: () => void;
}>;

export const useEnemyStore = create<EnemyState>((set) => ({
  ...initialState,

  // Actions
  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== id),
    })),

  resetEnemies: () => {
    const newEnemies: GameEntity[] = [];
    for (const row of Array.from({ length: ENEMY_ROWS }, (_, i) => i)) {
      for (const col of Array.from({ length: ENEMIES_PER_ROW }, (_, i) => i)) {
        const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
        const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
        newEnemies.push(createEntity("ENEMY", [x, y]));
      }
    }
    set({ enemies: newEnemies });
  },
}));
