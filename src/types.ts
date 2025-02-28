import { Sprite } from "pixi.js";
import { MutableRefObject } from "react";

export type Point = readonly [number, number];
export type Size = readonly [number, number];

export type EntityType =
  | "PLAYER"
  | "ENEMY"
  | "PLAYER_MISSILE"
  | "ENEMY_MISSILE"
  | "PLAYER_EXPLOSION"
  | "ENEMY_EXPLOSION";

export type BaseEntity = Readonly<{
  id: number;
  position: Point;
  spriteRef: MutableRefObject<Sprite | null>;
  texture: string;
  size: Size;
}>;

export type PlayerEntity = BaseEntity &
  Readonly<{
    type: "PLAYER";
    velocity: Point;
    explosionTexture: string;
  }>;

export type EnemyEntity = BaseEntity &
  Readonly<{
    type: "ENEMY";
    explosionTexture: string;
  }>;

export type PlayerMissileEntity = BaseEntity &
  Readonly<{
    type: "PLAYER_MISSILE";
    velocity: Point;
  }>;

export type EnemyMissileEntity = BaseEntity &
  Readonly<{
    type: "ENEMY_MISSILE";
    velocity: Point;
  }>;

export type PlayerExplosionEntity = BaseEntity &
  Readonly<{
    type: "PLAYER_EXPLOSION";
  }>;

export type EnemyExplosionEntity = BaseEntity &
  Readonly<{
    type: "ENEMY_EXPLOSION";
  }>;

export type MissileEntity = PlayerMissileEntity | EnemyMissileEntity;

export type ExplosionEntity = PlayerExplosionEntity | EnemyExplosionEntity;

export type GameEntity =
  | PlayerEntity
  | EnemyEntity
  | MissileEntity
  | ExplosionEntity;

export type PlayerAnimationState = "IDLE" | "LEFT" | "RIGHT";
export type GameState = "START" | "PLAYING" | "VICTORY" | "GAME_OVER";
