import { Sprite } from "pixi.js";
import { MutableRefObject } from "react";
import { GameComponent, GameEntity, Point, Size } from "@/types";

export const getComponent = <T extends GameComponent>(
  entity: GameEntity,
  type: T["type"]
): T | undefined => {
  return entity.components?.find((c) => c.type === type) as T | undefined;
};

export type SpriteComponent = GameComponent &
  Readonly<{
    type: "SPRITE";
    initialPosition: Point;
    size: Size;
    texture: string;
    ref: MutableRefObject<Sprite | null>;
  }>;

export const createSpriteComponent = (
  position: Point,
  size: Size,
  texture: string
): SpriteComponent => ({
  type: "SPRITE",
  initialPosition: position,
  size,
  texture,
  ref: { current: null } as MutableRefObject<Sprite | null>,
});

const getSpriteComponent = (
  entity: GameEntity
): SpriteComponent | undefined => {
  return getComponent<SpriteComponent>(entity, "SPRITE");
};

export const getSpriteInitialPosition = (entity: GameEntity): Point => {
  return getSpriteComponent(entity)?.initialPosition ?? [0, 0];
};

export const getSpriteSize = (entity: GameEntity): Size => {
  return getSpriteComponent(entity)?.size ?? [0, 0];
};

export const getSpriteTexture = (entity: GameEntity): string => {
  return getSpriteComponent(entity)?.texture ?? "";
};

export const getSpriteRef = (
  entity: GameEntity
): MutableRefObject<Sprite | null> => {
  const spriteRef = getComponent<SpriteComponent>(entity, "SPRITE")?.ref;
  if (!spriteRef) return { current: null };
  return spriteRef;
};

export type MovementComponent = GameComponent &
  Readonly<{
    type: "MOVEMENT";
    velocity: Point;
  }>;

export const createMovementComponent = (
  velocity: Point = [0, 0]
): MovementComponent => ({
  type: "MOVEMENT",
  velocity,
});

const getMovementComponent = (
  entity: GameEntity
): MovementComponent | undefined => {
  return getComponent<MovementComponent>(entity, "MOVEMENT");
};

const isMovement = (
  component: GameComponent
): component is MovementComponent => {
  return component.type === "MOVEMENT";
};

export const getVelocity = (entity: GameEntity): Point => {
  return getMovementComponent(entity)?.velocity ?? [0, 0];
};

export const setVelocity = (
  entity: GameEntity,
  velocity: Point
): GameEntity => {
  return {
    ...entity,
    components: entity.components?.map((c) =>
      isMovement(c) ? { ...c, velocity } : c
    ),
  };
};

export type ExplosiveComponent = GameComponent &
  Readonly<{
    type: "EXPLOSIVE";
    alive: boolean;
    texture: string;
  }>;

export const createExplosiveComponent = (
  texture: string
): ExplosiveComponent => ({
  type: "EXPLOSIVE",
  alive: true,
  texture,
});

export const isExplosive = (
  component: GameComponent
): component is ExplosiveComponent => {
  return component.type === "EXPLOSIVE";
};

const getExplosiveComponent = (
  entity: GameEntity
): ExplosiveComponent | undefined => {
  return getComponent<ExplosiveComponent>(entity, "EXPLOSIVE");
};

export const isAlive = (entity: GameEntity): boolean => {
  const component = getExplosiveComponent(entity);
  return component?.alive !== false;
};

export const setAlive = (entity: GameEntity, alive: boolean): GameEntity => {
  return {
    ...entity,
    components: entity.components?.map((c) =>
      isExplosive(c) ? { ...c, alive } : c
    ),
  };
};

export const getExplosionTexture = (entity: GameEntity): string => {
  const explosive = getExplosiveComponent(entity);
  return explosive?.texture ?? "";
};
