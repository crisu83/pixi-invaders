import { create } from "zustand";
import { STAGE_SIZE } from "@/constants";
import { PlayerEntity, Point } from "@/types";
import { createEntity } from "@/utils/entity-factory";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  player: null,
  playerVelocity: [0, 0] as Point,
} as const;

type PlayerState = Readonly<{
  // State
  player: PlayerEntity | null;
  playerVelocity: Point;

  // Actions
  setPlayerVelocity: (velocity: Point) => void;
  updatePlayer: (player: PlayerEntity) => void;
  resetPlayer: () => void;
}>;

export const usePlayerStore = create<PlayerState>((set) => ({
  ...initialState,

  // Actions
  setPlayerVelocity: (velocity) => set({ playerVelocity: velocity }),
  updatePlayer: (player) => set({ player }),
  resetPlayer: () =>
    set({
      ...initialState,
      player: createEntity("PLAYER", [0, stageHeight / 3]) as PlayerEntity,
    }),
}));
