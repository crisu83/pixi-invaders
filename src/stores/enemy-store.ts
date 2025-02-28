import { create } from "zustand";
import {
  ENEMIES_PER_ROW,
  ENEMY_ROWS,
  ENEMY_SPACING,
  STAGE_SIZE,
} from "@/constants";
import { EnemyEntity } from "@/types";
import { createEntity } from "@/utils/entity-factory";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  enemies: [] as EnemyEntity[],
} as const;

type EnemyState = Readonly<{
  // State
  enemies: EnemyEntity[];

  // Actions
  removeEnemy: (id: number) => void;
  resetEnemies: () => void;
  updateEnemies: (enemies: EnemyEntity[]) => void;
}>;

export const useEnemyStore = create<EnemyState>((set) => ({
  ...initialState,

  // Actions
  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== id),
    })),

  updateEnemies: (enemies) => set({ enemies }),

  resetEnemies: () => {
    const newEnemies: EnemyEntity[] = [];
    for (const row of Array.from({ length: ENEMY_ROWS }, (_, i) => i)) {
      for (const col of Array.from({ length: ENEMIES_PER_ROW }, (_, i) => i)) {
        const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
        const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
        newEnemies.push(createEntity("ENEMY", [x, y]) as EnemyEntity);
      }
    }
    set({ enemies: newEnemies });
  },
}));
