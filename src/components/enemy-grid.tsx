import { Container, useTick } from "@pixi/react";
import { useRef } from "react";
import {
  ENEMY_SIZE,
  ENEMY_SPEED,
  ENEMY_MARGIN,
  MISSILE_COOLDOWN,
} from "../constants";
import { Enemy } from "./enemy";
import { STAGE_SIZE } from "../constants";
import { GameEntity, Point } from "../types";
import { isAlive } from "../utils/entity";

export function EnemyGrid({
  enemies,
  onUpdateEnemies,
  onMissileSpawn,
}: {
  enemies: GameEntity[];
  onUpdateEnemies: (enemies: GameEntity[]) => void;
  onMissileSpawn: (position: Point) => void;
}) {
  const [stageWidth] = STAGE_SIZE;
  const enemyDirection = useRef(1);
  const lastFireTime = useRef(0);

  useTick((delta) => {
    const moveAmount = ENEMY_SPEED * delta * enemyDirection.current;
    let needsToMoveDown = false;

    // Only check boundary collisions for alive enemies
    const wouldHitBoundary = enemies.some((enemy) => {
      if (!isAlive(enemy)) return false;
      const newX = enemy.position[0] + moveAmount;
      return Math.abs(newX) > (stageWidth - ENEMY_MARGIN * 2) / 2;
    });

    if (wouldHitBoundary) {
      enemyDirection.current *= -1;
      needsToMoveDown = true;
    }

    onUpdateEnemies(
      enemies.map((enemy) => {
        // Don't move dead enemies
        if (!isAlive(enemy)) return enemy;

        return {
          ...enemy,
          position: [
            enemy.position[0] + (wouldHitBoundary ? 0 : moveAmount),
            enemy.position[1] + (needsToMoveDown ? ENEMY_SIZE[1] : 0),
          ] as Point,
        };
      })
    );

    // Random firing logic
    const currentTime = Date.now();
    if (currentTime - lastFireTime.current > MISSILE_COOLDOWN) {
      if (Math.random() < 0.02 && enemies.length > 0) {
        const columns = new Map<number, { position: Point; lowestY: number }>();

        // Only consider alive enemies
        for (const enemy of enemies.filter(isAlive)) {
          const x = Math.round(enemy.position[0]);
          const current = columns.get(x);
          if (!current || enemy.position[1] > current.lowestY) {
            columns.set(x, {
              position: enemy.position,
              lowestY: enemy.position[1],
            });
          }
        }

        const frontEnemies = Array.from(columns.values());
        if (frontEnemies.length > 0) {
          const shooter =
            frontEnemies[Math.floor(Math.random() * frontEnemies.length)];
          onMissileSpawn(shooter.position);
          lastFireTime.current = currentTime;
        }
      }
    }
  });

  return (
    <Container>
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.position}
          alive={isAlive(enemy)}
        />
      ))}
    </Container>
  );
}
