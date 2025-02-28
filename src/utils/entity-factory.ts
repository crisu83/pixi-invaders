import {
  ENEMY_SIZE,
  EXPLOSION_SIZE,
  MISSILE_SIZE,
  PLAYER_SIZE,
} from "@/constants";
import {
  EntityType,
  Point,
  PlayerEntity,
  EnemyEntity,
  PlayerMissileEntity,
  EnemyMissileEntity,
  PlayerExplosionEntity,
  EnemyExplosionEntity,
} from "@/types";

type EntityTypeToEntity = {
  PLAYER: PlayerEntity;
  ENEMY: EnemyEntity;
  PLAYER_MISSILE: PlayerMissileEntity;
  ENEMY_MISSILE: EnemyMissileEntity;
  PLAYER_EXPLOSION: PlayerExplosionEntity;
  ENEMY_EXPLOSION: EnemyExplosionEntity;
};

let nextEntityId = 1;

export const createEntity = <T extends EntityType>(
  type: T,
  position: Point
): EntityTypeToEntity[T] => {
  const baseEntity = {
    id: nextEntityId++,
    position,
    spriteRef: { current: null },
  } as const;

  switch (type) {
    case "PLAYER":
      return {
        ...baseEntity,
        type,
        size: PLAYER_SIZE,
        texture: "ship_01.png",
        velocity: [0, 0] as const,
        explosionTexture: "explosion_02.png",
      } as unknown as EntityTypeToEntity[T];
    case "ENEMY":
      return {
        ...baseEntity,
        type,
        size: ENEMY_SIZE,
        texture: "ship_02.png",
        explosionTexture: "explosion_04.png",
      } as unknown as EntityTypeToEntity[T];
    case "PLAYER_MISSILE":
      return {
        ...baseEntity,
        type,
        size: MISSILE_SIZE,
        texture: "missile_01.png",
        velocity: [0, 0] as const,
      } as unknown as EntityTypeToEntity[T];
    case "ENEMY_MISSILE":
      return {
        ...baseEntity,
        type,
        size: MISSILE_SIZE,
        texture: "missile_02.png",
        velocity: [0, 0] as const,
      } as unknown as EntityTypeToEntity[T];
    case "PLAYER_EXPLOSION":
      return {
        ...baseEntity,
        type,
        size: EXPLOSION_SIZE,
        texture: "explosion_02.png",
      } as unknown as EntityTypeToEntity[T];
    case "ENEMY_EXPLOSION":
      return {
        ...baseEntity,
        type,
        size: EXPLOSION_SIZE,
        texture: "explosion_04.png",
      } as unknown as EntityTypeToEntity[T];
  }
  // This should never happen due to the exhaustive type check
  throw new Error(`Unknown entity type: ${type}`);
};
