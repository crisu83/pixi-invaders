import { create } from "zustand";
import { STAGE_SIZE } from "@/constants";
import { GameEntity, Point } from "@/types";
import { createEntity } from "@/utils/entity-factory";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  player: null,
  playerVelocity: [0, 0] as Point,
} as const;

type PlayerState = Readonly<{
  // State
  player: GameEntity | null;
  playerVelocity: Point;

  // Actions
  setPlayerVelocity: (velocity: Point) => void;
  updatePlayer: (player: GameEntity) => void;
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
      player: createEntity("PLAYER", [0, stageHeight / 3]),
    }),
}));
