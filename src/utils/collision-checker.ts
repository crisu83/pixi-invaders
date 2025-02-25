import { useMemo } from "react";
import { ENEMY_SIZE, MISSILE_SIZE, PLAYER_SIZE } from "../constants";
import { usePlayerStore } from "../stores/player-store";
import { useMissileStore } from "../stores/missile-store";
import { useEnemyStore } from "../stores/enemy-store";
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
};

export function createCollisionChecker({
  player,
  enemies,
  playerMissiles,
  enemyMissiles,
}: CollisionCheckerDeps) {
  // Cache player bounds since they're used in multiple checks
  const playerBounds = player ? getEntityBounds(player, PLAYER_SIZE) : null;

  return {
    checkMissileEnemyCollisions: (): CollisionResult => {
      // Sort both missiles and enemies by y-position for optimal collision checks
      const sortedMissiles = sortEntitiesByY(
        playerMissiles,
        MISSILE_SIZE,
        false
      ); // Bottom to top (missiles move up)
      const sortedEnemies = sortEntitiesByY(enemies, ENEMY_SIZE, true); // Top to bottom

      // Since missiles move up and enemies move down, we can optimize the collision checks
      for (const missile of sortedMissiles) {
        const missileBounds = getEntityBounds(missile, MISSILE_SIZE);
        if (!missileBounds) continue;

        // Only check enemies that could possibly collide with this missile
        for (const enemy of sortedEnemies) {
          const enemyBounds = getEntityBounds(enemy, ENEMY_SIZE);
          if (!enemyBounds) continue;

          // Skip enemies that are too far below (haven't reached missile yet)
          if (enemyBounds.top > missileBounds.bottom) {
            break; // Rest of enemies are even lower, so we can stop
          }

          // Skip enemies that are too far above (missile already passed)
          if (enemyBounds.bottom < missileBounds.top) {
            continue;
          }

          // Only if vertically aligned, check horizontal alignment
          if (
            missileBounds.left < enemyBounds.right &&
            missileBounds.right > enemyBounds.left
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
      if (!player || !playerBounds) return { collision: false };

      for (const missile of enemyMissiles) {
        const missileBounds = getEntityBounds(missile, MISSILE_SIZE);
        if (!missileBounds) continue;

        // Since enemy missiles move down and player is below,
        // we can skip if the missile is below the player
        if (missileBounds.top > playerBounds.bottom) {
          continue;
        }

        // Check vertical alignment first
        if (
          checkVerticalCollision(
            missileBounds,
            playerBounds,
            MISSILE_SIZE[1],
            PLAYER_SIZE[1]
          )
        ) {
          // Only check horizontal alignment if vertically aligned
          if (
            missileBounds.left < playerBounds.right &&
            missileBounds.right > playerBounds.left
          ) {
            return {
              collision: true,
              entity1: missile,
              entity2: player,
            };
          }
        }
      }
      return { collision: false };
    },

    checkEnemyPlayerCollisions: (): CollisionResult => {
      if (!player) return { collision: false };

      // For enemy-player collisions, we only need to check if any enemy has reached the player's y-position
      const playerY = getEntityY(player);
      if (playerY === null) return { collision: false };

      // Find the lowest enemy (they all move together)
      const lowestEnemy = enemies.reduce<{
        enemy: GameEntity | null;
        y: number;
      }>(
        (lowest, enemy) => {
          const y = getEntityY(enemy);
          if (y !== null && (lowest.enemy === null || y > lowest.y)) {
            return { enemy, y };
          }
          return lowest;
        },
        { enemy: null, y: -Infinity }
      );

      // If any enemy has reached the player's vertical position
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
  return useMemo(
    () =>
      createCollisionChecker({
        player,
        enemies,
        playerMissiles,
        enemyMissiles,
      }),
    [player, enemies, playerMissiles, enemyMissiles]
  );
}
