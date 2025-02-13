export type Point = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";

export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;
export const SPRITE_SIZE = 128;
export const PLAYER_SIZE = 20;
export const PLAYER_SPEED = 3;
export const ANIMATION_SPEED = 0.1;

export const FRAMES: Record<PlayerAnimationState, [number, number]> = {
  IDLE: [0, 1],
  TILT_LEFT: [2, 3],
  TILT_RIGHT: [4, 5],
};
