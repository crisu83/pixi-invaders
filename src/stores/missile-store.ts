import { create } from "zustand";
import { GameEntity } from "../types";

const initialState = {
  playerMissiles: [] as GameEntity[],
  enemyMissiles: [] as GameEntity[],
} as const;

type MissileState = Readonly<{
  // State
  playerMissiles: GameEntity[];
  enemyMissiles: GameEntity[];

  // Actions
  addPlayerMissile: (missile: GameEntity) => void;
  addEnemyMissile: (missile: GameEntity) => void;
  removePlayerMissile: (id: number) => void;
  removeEnemyMissile: (id: number) => void;
  resetMissiles: () => void;
}>;

export const useMissileStore = create<MissileState>((set) => ({
  ...initialState,

  // Actions
  addPlayerMissile: (missile) =>
    set((state) => ({
      playerMissiles: [...state.playerMissiles, missile],
    })),

  addEnemyMissile: (missile) =>
    set((state) => ({
      enemyMissiles: [...state.enemyMissiles, missile],
    })),

  removePlayerMissile: (id) =>
    set((state) => ({
      playerMissiles: state.playerMissiles.filter((m) => m.id !== id),
    })),

  removeEnemyMissile: (id) =>
    set((state) => ({
      enemyMissiles: state.enemyMissiles.filter((m) => m.id !== id),
    })),

  resetMissiles: () => set(initialState),
}));
