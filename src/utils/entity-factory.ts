import {
  ENEMY_SIZE,
  EXPLOSION_SIZE,
  MISSILE_SIZE,
  PLAYER_SIZE,
} from "@/constants";
import {
  EntityType,
  GameEntity,
  Point,
  PlayerEntity,
  EnemyEntity,
  PlayerMissileEntity,
  EnemyMissileEntity,
  PlayerExplosionEntity,
  EnemyExplosionEntity,
} from "@/types";

let nextEntityId = 1;

export const createEntity = (type: EntityType, position: Point): GameEntity => {
  const baseEntity = {
    id: nextEntityId++,
    position,
    spriteRef: { current: null },
  };

  switch (type) {
    case "PLAYER":
      return {
        ...baseEntity,
        type,
        size: PLAYER_SIZE,
        texture: "ship_01.png",
        velocity: [0, 0],
        alive: true,
        explosionTexture: "explosion_02.png",
      } as PlayerEntity;
    case "ENEMY":
      return {
        ...baseEntity,
        type,
        size: ENEMY_SIZE,
        texture: "ship_02.png",
        alive: true,
        explosionTexture: "explosion_04.png",
      } as EnemyEntity;
    case "PLAYER_MISSILE":
      return {
        ...baseEntity,
        type,
        size: MISSILE_SIZE,
        texture: "missile_01.png",
        velocity: [0, 0],
      } as PlayerMissileEntity;
    case "ENEMY_MISSILE":
      return {
        ...baseEntity,
        type,
        size: MISSILE_SIZE,
        texture: "missile_02.png",
        velocity: [0, 0],
      } as EnemyMissileEntity;
    case "PLAYER_EXPLOSION":
      return {
        ...baseEntity,
        type,
        size: EXPLOSION_SIZE,
        texture: "explosion_02.png",
      } as PlayerExplosionEntity;
    case "ENEMY_EXPLOSION":
      return {
        ...baseEntity,
        type,
        size: EXPLOSION_SIZE,
        texture: "explosion_04.png",
      } as EnemyExplosionEntity;
  }
};
