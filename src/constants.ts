import { PlayerAnimationState, Size } from "@/types";

export const SPRITE_SCALE = 1;
export const ANIMATION_SPEED = 0.1;

export const STAGE_SIZE: Size = [800, 600];
export const STARS_SIZE: Size = [128, 128];
export const STAGE_MARGIN = 100;
export const BACKGROUND_SCROLL_SPEED = 0.3;

export const PLAYER_SIZE: Size = [20, 20];
export const PLAYER_SPEED = 3;
export const PLAYER_BOOST_MULTIPLIER = 1.5;
export const PLAYER_FRAMES: Record<PlayerAnimationState, [number, number]> = {
  IDLE: [0, 1],
  LEFT: [2, 3],
  RIGHT: [4, 5],
};

export const MISSILE_SIZE: Size = [5, 20];
export const MISSILE_SPEED = 8;
export const MISSILE_COOLDOWN = 250;

export const TOGGLE_COOLDOWN = 100;

export const HOLD_DURATION = 500; // ms

export const ENEMY_SIZE: Size = [20, 20];
export const ENEMY_SPEED = 1;
export const ENEMY_SPAWN_INTERVAL = 5000;
export const ENEMY_ROWS = 3;
export const ENEMIES_PER_ROW = 8;
export const ENEMY_SPACING: Size = [60, 50]; // More horizontal and vertical space

export const EXPLOSION_SIZE: Size = [20, 20];
