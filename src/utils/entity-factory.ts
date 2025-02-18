import { GameEntity, EntityType, Point, ExplosiveComponent } from "../types";

let nextEntityId = 1;

export const createEntity = (type: EntityType, position: Point): GameEntity => {
  const base = {
    id: nextEntityId++,
    type,
    position,
  };

  switch (type) {
    case "ENEMY":
      return {
        ...base,
        components: [
          {
            type: "EXPLOSIVE",
            alive: true,
            texture: "explosion_04.png",
          } as ExplosiveComponent,
        ],
      };
    case "PLAYER":
      return {
        ...base,
        components: [
          {
            type: "EXPLOSIVE",
            texture: "explosion_02.png",
            alive: true,
          } as ExplosiveComponent,
        ],
      };
    case "MISSILE":
      return base;
  }
};
