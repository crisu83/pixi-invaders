import { create } from "zustand";
import { GameEntity, Point } from "../types";
import { createEntity } from "../utils/entity-factory";
import { STAGE_SIZE } from "../constants";

const [, stageHeight] = STAGE_SIZE;

const initialState = {
  player: createEntity("PLAYER", [0, stageHeight / 3]),
  velocity: [0, 0] as Point,
} as const;

type PlayerState = Readonly<{
  // State
  player: GameEntity;
  velocity: Point;

  // Actions
  setVelocity: (velocity: Point) => void;
  updatePlayer: (player: GameEntity) => void;
  resetPlayer: () => void;
}>;

export const usePlayerStore = create<PlayerState>((set) => ({
  ...initialState,

  // Actions
  setVelocity: (velocity) => set({ velocity }),
  updatePlayer: (player) => set({ player }),
  resetPlayer: () => set(initialState),
}));
