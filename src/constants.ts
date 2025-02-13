export type Point = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";
export type Size = [number, number];

export const SPRITE_SCALE = 2;
export const ANIMATION_SPEED = 0.1;

export const STAGE_SIZE: Size = [800, 600];

export const STARS_SIZE: Size = [128, 128];

export const PLAYER_SIZE: Size = [20, 20];
export const PLAYER_SPEED = 3;
export const PLAYER_BOOST_MULTIPLIER = 1.5;
export const PLAYER_FRAMES: Record<PlayerAnimationState, [number, number]> = {
  IDLE: [0, 1],
  TILT_LEFT: [2, 3],
  TILT_RIGHT: [4, 5],
};

export const MISSILE_SIZE: Size = [5, 20];
export const MISSILE_SPEED = 8;
export const MISSLE_COOLDOWN = 250;

export const ENEMY_SIZE: Size = [20, 20];
export const ENEMY_SPEED = 2;
export const ENEMY_SPAWN_INTERVAL = 5000;

export const ENEMY_ROWS = 3;
export const ENEMIES_PER_ROW = 8;
export const ENEMY_SPACING: Size = [60, 50]; // More horizontal and vertical space
export const ENEMY_MARGIN = 100; // Keep enemies this far from stage edges
