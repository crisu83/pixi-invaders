import { GameEntity, GameComponent, ExplosiveComponent } from "../types";

export const getComponent = <T extends GameComponent>(
  entity: GameEntity,
  type: T["type"]
): T | undefined => {
  return entity.components?.find((c) => c.type === type) as T | undefined;
};

export const isExplosive = (
  component: GameComponent
): component is ExplosiveComponent => {
  return component.type === "EXPLOSIVE";
};

export const isAlive = (entity: GameEntity): boolean => {
  const component = entity.components?.find(isExplosive);
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
  const explosive = getComponent<ExplosiveComponent>(entity, "EXPLOSIVE");
  return explosive?.texture ?? "";
};
