import { MutableRefObject } from "react";
import { Sprite } from "pixi.js";

export type Point = [number, number];
export type Size = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";
export type GameScene = "START" | "PLAYING" | "VICTORY" | "GAME_OVER";
export type ComponentType = "SPRITE" | "MOVEMENT" | "EXPLOSIVE";
export type EntityType = "PLAYER" | "ENEMY" | "MISSILE" | "EXPLOSION";
export type EntityVariant = "PLAYER" | "ENEMY";

export type GameComponent = Readonly<{
  type: ComponentType;
}>;

export type SpriteComponent = GameComponent &
  Readonly<{
    type: "SPRITE";
    initialPosition: Point;
    size: Size;
    texture: string;
    ref: MutableRefObject<Sprite | null>;
  }>;

export type MovementComponent = GameComponent &
  Readonly<{
    type: "MOVEMENT";
    velocity: Point;
  }>;

export type ExplosiveComponent = GameComponent &
  Readonly<{
    type: "EXPLOSIVE";
    alive: boolean;
    texture: string;
  }>;

export type GameEntity = Readonly<{
  id: number;
  type: EntityType;
  components: readonly GameComponent[];
}>;
