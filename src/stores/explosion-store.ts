import { create } from "zustand";
import { GameEntity } from "../types";

type ExplosionState = Readonly<{
  // State
  explosions: GameEntity[];

  // Actions
  addExplosion: (explosion: GameEntity) => void;
  removeExplosion: (id: number) => void;
  resetExplosions: () => void;
}>;

export const useExplosionStore = create<ExplosionState>((set) => ({
  // Initial state
  explosions: [],

  // Actions
  addExplosion: (explosion) =>
    set((state) => ({
      explosions: [...state.explosions, explosion],
    })),

  removeExplosion: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((e) => e.id !== id),
    })),

  resetExplosions: () => set({ explosions: [] }),
}));
