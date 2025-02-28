import { create } from "zustand";
import { ExplosionEntity } from "@/types";

const initialState = {
  explosions: [] as ExplosionEntity[],
} as const;

type ExplosionState = Readonly<{
  // State
  explosions: ExplosionEntity[];

  // Actions
  addExplosion: (explosion: ExplosionEntity) => void;
  removeExplosion: (id: number) => void;
  resetExplosions: () => void;
}>;

export const useExplosionStore = create<ExplosionState>((set) => ({
  ...initialState,

  // Actions
  addExplosion: (explosion) =>
    set((state) => ({
      explosions: [...state.explosions, explosion],
    })),

  removeExplosion: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((e) => e.id !== id),
    })),

  resetExplosions: () => set(initialState),
}));
