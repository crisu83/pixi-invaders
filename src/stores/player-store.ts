import { create } from "zustand";
import { STAGE_SIZE } from "@/constants";
import { PlayerEntity } from "@/types";
import { createEntity } from "@/utils/entity-factory";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  player: null,
} as const;

type PlayerState = Readonly<{
  // State
  player: PlayerEntity | null;

  // Actions
  updatePlayer: (player: PlayerEntity) => void;
  removePlayer: () => void;
  resetPlayer: () => void;
}>;

export const usePlayerStore = create<PlayerState>((set) => ({
  ...initialState,

  // Actions
  updatePlayer: (player) => set({ player }),
  removePlayer: () => set({ ...initialState }),
  resetPlayer: () =>
    set({
      ...initialState,
      player: createEntity("PLAYER", [0, stageHeight / 3]) as PlayerEntity,
    }),
}));
