import {
  ENEMY_SIZE,
  EXPLOSION_SIZE,
  MISSILE_SIZE,
  PLAYER_SIZE,
} from "../constants";
import { EntityType, EntityVariant, GameEntity, Point } from "../types";
import {
  createExplosiveComponent,
  createMovementComponent,
  createSpriteComponent,
} from "./components";

export const VARIANT_TEXTURES = {
  MISSILE: {
    PLAYER: "missile_01.png",
    ENEMY: "missile_02.png",
  },
  EXPLOSION: {
    PLAYER: "explosion_02.png",
    ENEMY: "explosion_04.png",
  },
} as const;

let nextEntityId = 1;

export const createEntity = (
  type: EntityType,
  position: Point,
  variant: EntityVariant = "PLAYER"
): GameEntity => {
  const base = {
    id: nextEntityId++,
    type,
    components: [],
  };

  switch (type) {
    case "PLAYER":
      return {
        ...base,
        components: [
          createSpriteComponent(position, PLAYER_SIZE, "ship_01.png"),
          createMovementComponent(),
          createExplosiveComponent("explosion_02.png"),
        ],
      };
    case "ENEMY":
      return {
        ...base,
        components: [
          createSpriteComponent(position, ENEMY_SIZE, "ship_02.png"),
          createExplosiveComponent("explosion_04.png"),
        ],
      };
    case "MISSILE":
      return {
        ...base,
        components: [
          createSpriteComponent(
            position,
            MISSILE_SIZE,
            VARIANT_TEXTURES.MISSILE[variant]
          ),
          createMovementComponent(),
        ],
      };
    case "EXPLOSION":
      return {
        ...base,
        components: [
          createSpriteComponent(
            position,
            EXPLOSION_SIZE,
            VARIANT_TEXTURES.EXPLOSION[variant]
          ),
        ],
      };
  }
};
