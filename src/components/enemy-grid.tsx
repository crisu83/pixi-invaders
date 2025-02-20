import { Container, useTick } from "@pixi/react";
import { useRef } from "react";
import { Sprite as PixiSprite } from "pixi.js";
import {
  ENEMY_SIZE,
  ENEMY_SPEED,
  ENEMY_MARGIN,
  MISSILE_COOLDOWN,
} from "../constants";
import { Enemy } from "./enemy";
import { STAGE_SIZE } from "../constants";
import { GameEntity, Point } from "../types";
import { getSpriteRef, isAlive } from "../utils/components";

export function EnemyGrid({
  enemies,
  onMissileSpawn,
}: {
  enemies: GameEntity[];
  onMissileSpawn: (position: Point) => void;
}) {
  const [stageWidth] = STAGE_SIZE;

  const lastFireTime = useRef(0);
  const enemyDirection = useRef(1);

  useTick((delta) => {
    const moveAmount = ENEMY_SPEED * delta * enemyDirection.current;
    let needsToMoveDown = false;

    // Only check boundary collisions for alive enemies
    const wouldHitBoundary = enemies.some((enemy) => {
      const sprite = getSpriteRef(enemy).current;
      if (!isAlive(enemy) || !sprite) return false;
      const newX = sprite.x + moveAmount;
      return Math.abs(newX) > (stageWidth - ENEMY_MARGIN * 2) / 2;
    });

    if (wouldHitBoundary) {
      enemyDirection.current *= -1;
      needsToMoveDown = true;
    }

    // Update enemy positions directly through sprite refs
    enemies.forEach((enemy) => {
      // Don't move dead enemies or those without refs
      const sprite = getSpriteRef(enemy).current;
      if (!isAlive(enemy) || !sprite) return;

      if (!wouldHitBoundary) {
        sprite.x += moveAmount;
      }
      if (needsToMoveDown) {
        sprite.y += ENEMY_SIZE[1];
      }
    });

    // Random firing logic
    const currentTime = Date.now();
    if (currentTime - lastFireTime.current > MISSILE_COOLDOWN) {
      if (Math.random() < 0.02 && enemies.length > 0) {
        const columns = new Map<
          number,
          { sprite: PixiSprite; lowestY: number }
        >();

        // Only consider alive enemies
        for (const enemy of enemies.filter(isAlive)) {
          const sprite = getSpriteRef(enemy).current;
          if (!sprite) continue;
          const x = Math.round(sprite.x);
          const y = sprite.y;
          const current = columns.get(x);
          if (!current || y > current.lowestY) {
            columns.set(x, { sprite, lowestY: y });
          }
        }

        const frontEnemies = Array.from(columns.values());
        if (frontEnemies.length > 0) {
          const shooter =
            frontEnemies[Math.floor(Math.random() * frontEnemies.length)];
          onMissileSpawn([shooter.sprite.x, shooter.sprite.y]);
          lastFireTime.current = currentTime;
        }
      }
    }
  });

  return (
    <Container>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} entity={enemy} ref={getSpriteRef(enemy)} />
      ))}
    </Container>
  );
}
