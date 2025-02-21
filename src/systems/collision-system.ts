import { ENEMY_SIZE, MISSILE_SIZE, PLAYER_SIZE } from "../constants";
import { GameEntity, GameState, Size } from "../types";
import { getSpriteRef } from "../utils/components";
import { createEntity } from "../utils/entity-factory";

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

export function createCollisionSystem(gameState: GameState) {
  return {
    checkMissileEnemyCollisions: () => {
      for (const missile of gameState.playerMissiles) {
        for (const enemy of gameState.enemies) {
          if (
            checkBoundingBoxCollision(missile, enemy, MISSILE_SIZE, ENEMY_SIZE)
          ) {
            gameState.removePlayerMissile(missile.id);
            const sprite = getSpriteRef(enemy).current;
            if (sprite) {
              gameState.removeEnemy(enemy.id);
              const explosion = createEntity(
                "EXPLOSION",
                [sprite.x, sprite.y],
                "ENEMY"
              );
              gameState.addExplosion(explosion);
              gameState.setScore(gameState.score + 100);
            }
            break;
          }
        }
      }
    },

    checkMissilePlayerCollisions: () => {
      for (const missile of gameState.enemyMissiles) {
        if (
          checkBoundingBoxCollision(
            missile,
            gameState.player,
            MISSILE_SIZE,
            PLAYER_SIZE
          )
        ) {
          gameState.removeEnemyMissile(missile.id);
          return true; // Player hit
        }
      }
      return false;
    },

    checkEnemyPlayerCollisions: () => {
      const sprite = getSpriteRef(gameState.player).current;
      if (!sprite) return false;

      return gameState.enemies.some((enemy) => {
        const enemySprite = getSpriteRef(enemy).current;
        return enemySprite && enemySprite.y >= sprite.y;
      });
    },
  };
}
