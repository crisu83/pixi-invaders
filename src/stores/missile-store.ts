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
  updateMissile: (missile: MissileEntity) => void;
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

  updateMissile: (missile) =>
    set((state) => ({
      missiles: state.missiles.map((m) => (m.id === missile.id ? missile : m)),
    })),

  removeMissile: (id) =>
    set((state) => ({
      missiles: state.missiles.filter((m) => m.id !== id),
    })),

  resetMissiles: () => set(initialState),
}));
