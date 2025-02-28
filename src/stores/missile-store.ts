import { create } from "zustand";
import { MissileEntity } from "@/types";

const initialState = {
  missiles: [] as MissileEntity[],
} as const;

type MissileState = Readonly<{
  // State
  missiles: MissileEntity[];

  // Actions
  addMissile: (missile: MissileEntity) => void;
  removeMissile: (id: number) => void;
  resetMissiles: () => void;
}>;

export const useMissileStore = create<MissileState>((set) => ({
  ...initialState,

  // Actions
  addMissile: (missile) =>
    set((state) => ({
      missiles: [...state.missiles, missile],
    })),

  removeMissile: (id) =>
    set((state) => ({
      missiles: state.missiles.filter((m) => m.id !== id),
    })),

  resetMissiles: () => set(initialState),
}));
