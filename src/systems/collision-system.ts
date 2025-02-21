import { useMemo } from "react";
import { ENEMY_SIZE, MISSILE_SIZE, PLAYER_SIZE } from "../constants";
import { useGameStore } from "../stores/game-store";
import { GameEntity, Size } from "../types";
import { getSpriteRef } from "../utils/components";

type CollisionResult = {
  collision: boolean;
  entity1?: GameEntity;
  entity2?: GameEntity;
};

function checkBoundingBoxCollision(
  entity1: GameEntity,
  entity2: GameEntity,
  size1: Size,
  size2: Size
) {
  const sprite1 = getSpriteRef(entity1).current;
  const sprite2 = getSpriteRef(entity2).current;
  if (!sprite1 || !sprite2) return false;

  const [width1, height1] = size1;
  const [width2, height2] = size2;

  const bounds1 = {
    left: sprite1.x - width1 / 2,
    right: sprite1.x + width1 / 2,
    top: sprite1.y - height1 / 2,
    bottom: sprite1.y + height1 / 2,
  };

  const bounds2 = {
    left: sprite2.x - width2 / 2,
    right: sprite2.x + width2 / 2,
    top: sprite2.y - height2 / 2,
    bottom: sprite2.y + height2 / 2,
  };

  return (
    bounds1.left < bounds2.right &&
    bounds1.right > bounds2.left &&
    bounds1.top < bounds2.bottom &&
    bounds1.bottom > bounds2.top
  );
}

type CollisionSystemDeps = {
  player: GameEntity;
  enemies: GameEntity[];
  playerMissiles: GameEntity[];
  enemyMissiles: GameEntity[];
};

export function createCollisionSystem({
  player,
  enemies,
  playerMissiles,
  enemyMissiles,
}: CollisionSystemDeps) {
  return {
    checkMissileEnemyCollisions: (): CollisionResult => {
      for (const missile of playerMissiles) {
        for (const enemy of enemies) {
          if (
            checkBoundingBoxCollision(missile, enemy, MISSILE_SIZE, ENEMY_SIZE)
          ) {
            return {
              collision: true,
              entity1: missile,
              entity2: enemy,
            };
          }
        }
      }
      return { collision: false };
    },

    checkMissilePlayerCollisions: (): CollisionResult => {
      for (const missile of enemyMissiles) {
        if (
          checkBoundingBoxCollision(missile, player, MISSILE_SIZE, PLAYER_SIZE)
        ) {
          return {
            collision: true,
            entity1: missile,
            entity2: player,
          };
        }
      }
      return { collision: false };
    },

    checkEnemyPlayerCollisions: (): CollisionResult => {
      const sprite = getSpriteRef(player).current;
      if (!sprite) return { collision: false };

      for (const enemy of enemies) {
        const enemySprite = getSpriteRef(enemy).current;
        if (enemySprite && enemySprite.y >= sprite.y) {
          return {
            collision: true,
            entity1: enemy,
            entity2: player,
          };
        }
      }
      return { collision: false };
    },
  };
}

export function useCollisionSystem() {
  const gameState = useGameStore();
  return useMemo(() => createCollisionSystem(gameState), [gameState]);
}
