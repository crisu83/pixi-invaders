export type Point = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";
export type Size = [number, number];

export const SPRITE_SCALE = 2;
export const ANIMATION_SPEED = 0.1;

export const STAGE_SIZE: Size = [800, 600];

export const STARS_SIZE: Size = [128, 128];

export const PLAYER_SIZE: Size = [20, 20];
export const PLAYER_SPEED = 3;
export const PLAYER_FRAMES: Record<PlayerAnimationState, [number, number]> = {
  IDLE: [0, 1],
  TILT_LEFT: [2, 3],
  TILT_RIGHT: [4, 5],
};

export const MISSILE_SIZE: Size = [5, 20];
export const MISSILE_SPEED = 8;
export const MISSLE_COOLDOWN = 250;
