import { GameEntity, EntityType, Point, ExplosiveComponent } from "../types";

let nextEntityId = 1;

const createExplosiveComponent = (texture: string): ExplosiveComponent => ({
  type: "EXPLOSIVE",
  alive: true,
  texture,
});

export const createEntity = (type: EntityType, position: Point): GameEntity => {
  const base = {
    id: nextEntityId++,
    type,
    position,
    components: [],
  };

  switch (type) {
    case "ENEMY":
      return {
        ...base,
        components: [createExplosiveComponent("explosion_04.png")],
      };
    case "PLAYER":
      return {
        ...base,
        components: [createExplosiveComponent("explosion_02.png")],
      };
    case "MISSILE":
      return base;
  }
};
