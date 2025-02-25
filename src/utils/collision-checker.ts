import { useMemo } from "react";
import { ENEMY_SIZE, MISSILE_SIZE, PLAYER_SIZE } from "../constants";
import { usePlayerStore } from "../stores/player-store";
import { useMissileStore } from "../stores/missile-store";
import { useEnemyStore } from "../stores/enemy-store";
import { useCollisionStore } from "../stores/collision-store";
import { GameEntity, Size } from "../types";
import { getSpriteRef } from "../utils/components";

type CollisionResult = {
  collision: boolean;
  entity1?: GameEntity;
  entity2?: GameEntity;
};

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

// Check if entities are close enough vertically to collide
function checkVerticalCollision(
  bounds1: Bounds,
  bounds2: Bounds,
  height1: number,
  height2: number
): boolean {
  const verticalDistance = Math.abs(bounds1.top - bounds2.top);
  return verticalDistance <= height1 + height2;
}

// Get entity bounds
function getEntityBounds(entity: GameEntity, size: Size): Bounds | null {
  const sprite = getSpriteRef(entity).current;
  if (!sprite) return null;

  const [width, height] = size;
  return {
    left: sprite.x - width / 2,
    right: sprite.x + width / 2,
    top: sprite.y - height / 2,
    bottom: sprite.y + height / 2,
  };
}

// Get just the y-position of an entity (for simple vertical checks)
function getEntityY(entity: GameEntity): number | null {
  const sprite = getSpriteRef(entity).current;
  return sprite ? sprite.y : null;
}

// Sort entities by vertical position
function sortEntitiesByY(
  entities: GameEntity[],
  size: Size,
  ascending: boolean = true
): GameEntity[] {
  return [...entities].sort((a, b) => {
    const boundsA = getEntityBounds(a, size);
    const boundsB = getEntityBounds(b, size);
    if (!boundsA || !boundsB) return 0;
    return ascending
      ? boundsA.top - boundsB.top // Top to bottom
      : boundsB.top - boundsA.top; // Bottom to top
  });
}

type CollisionCheckerDeps = {
  player: GameEntity | null;
  enemies: GameEntity[];
  playerMissiles: GameEntity[];
  enemyMissiles: GameEntity[];
  addChecks: (checks: number) => void;
  resetChecks: () => void;
};

export function createCollisionChecker({
  player,
  enemies,
  playerMissiles,
  enemyMissiles,
  addChecks,
  resetChecks,
}: CollisionCheckerDeps) {
  // Cache player bounds since they're used in multiple checks
  const playerBounds = player ? getEntityBounds(player, PLAYER_SIZE) : null;

  return {
    // Reset checks at the start of collision detection
    resetCollisionChecks: resetChecks,
    checkMissileEnemyCollisions: (): CollisionResult => {
      let checks = 0;
      const sortedMissiles = sortEntitiesByY(
        playerMissiles,
        MISSILE_SIZE,
        false
      );
      const sortedEnemies = sortEntitiesByY(enemies, ENEMY_SIZE, true);

      for (const missile of sortedMissiles) {
        const missileBounds = getEntityBounds(missile, MISSILE_SIZE);
        if (!missileBounds) continue;

        for (const enemy of sortedEnemies) {
          const enemyBounds = getEntityBounds(enemy, ENEMY_SIZE);
          if (!enemyBounds) continue;

          checks++;

          if (enemyBounds.top > missileBounds.bottom) {
            break;
          }

          if (enemyBounds.bottom < missileBounds.top) {
            continue;
          }

          if (
            missileBounds.left < enemyBounds.right &&
            missileBounds.right > enemyBounds.left
          ) {
            addChecks(checks);
            return {
              collision: true,
              entity1: missile,
              entity2: enemy,
            };
          }
        }
      }
      addChecks(checks);
      return { collision: false };
    },

    checkMissilePlayerCollisions: (): CollisionResult => {
      let checks = 0;
      if (!player || !playerBounds) return { collision: false };

      for (const missile of enemyMissiles) {
        const missileBounds = getEntityBounds(missile, MISSILE_SIZE);
        if (!missileBounds) continue;

        checks++;

        if (missileBounds.top > playerBounds.bottom) {
          continue;
        }

        if (
          checkVerticalCollision(
            missileBounds,
            playerBounds,
            MISSILE_SIZE[1],
            PLAYER_SIZE[1]
          )
        ) {
          if (
            missileBounds.left < playerBounds.right &&
            missileBounds.right > playerBounds.left
          ) {
            addChecks(checks);
            return {
              collision: true,
              entity1: missile,
              entity2: player,
            };
          }
        }
      }
      addChecks(checks);
      return { collision: false };
    },

    checkEnemyPlayerCollisions: (): CollisionResult => {
      let checks = 0;
      if (!player) return { collision: false };

      const playerY = getEntityY(player);
      if (playerY === null) return { collision: false };

      const lowestEnemy = enemies.reduce<{
        enemy: GameEntity | null;
        y: number;
      }>(
        (lowest, enemy) => {
          checks++;
          const y = getEntityY(enemy);
          if (y !== null && (lowest.enemy === null || y > lowest.y)) {
            return { enemy, y };
          }
          return lowest;
        },
        { enemy: null, y: -Infinity }
      );

      addChecks(checks);
      if (lowestEnemy.enemy && lowestEnemy.y >= playerY) {
        return {
          collision: true,
          entity1: lowestEnemy.enemy,
          entity2: player,
        };
      }

      return { collision: false };
    },
  };
}

export function useCollisionChecker() {
  const { player } = usePlayerStore();
  const { playerMissiles, enemyMissiles } = useMissileStore();
  const { enemies } = useEnemyStore();
  const { addChecks, resetChecks } = useCollisionStore();

  return useMemo(
    () =>
      createCollisionChecker({
        player,
        enemies,
        playerMissiles,
        enemyMissiles,
        addChecks,
        resetChecks,
      }),
    [player, enemies, playerMissiles, enemyMissiles, addChecks, resetChecks]
  );
}
