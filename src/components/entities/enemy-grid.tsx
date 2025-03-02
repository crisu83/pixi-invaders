import { useTick } from "@pixi/react";
import { useRef } from "react";
import {
  ENEMY_SPACING,
  ENEMY_SPEED,
  MISSILE_COOLDOWN,
  STAGE_MARGIN,
  STAGE_SIZE,
} from "@/constants";
import { useGameStore } from "@/stores/game-store";
import { EnemyEntity, Point } from "@/types";
import { getSpriteRef } from "@/utils/entity-helpers";
import { Enemy } from "./enemy";

type EnemyGridProps = {
  enemies: EnemyEntity[];
  onMissileSpawn: (position: Point) => void;
};

export function EnemyGrid({ enemies, onMissileSpawn }: EnemyGridProps) {
  const [stageWidth] = STAGE_SIZE;
  const updateEnemies = useGameStore((state) => state.updateEnemies);

  const lastFireTime = useRef(0);
  const enemyDirection = useRef(1);

  useTick((delta) => {
    const moveAmount = ENEMY_SPEED * delta * enemyDirection.current;
    let needsToMoveDown = false;

    // Only check boundary collisions for enemies
    const wouldHitBoundary = enemies.some((enemy) => {
      const newX = enemy.position[0] + moveAmount;
      return Math.abs(newX) > (stageWidth - STAGE_MARGIN * 2) / 2;
    });

    if (wouldHitBoundary) {
      enemyDirection.current *= -1;
      needsToMoveDown = true;
    }

    // Create new enemy entities with updated positions
    const updatedEnemies = enemies.map((enemy) => {
      const newX = enemy.position[0] + (needsToMoveDown ? 0 : moveAmount);
      const newY = enemy.position[1] + (needsToMoveDown ? ENEMY_SPACING[1] : 0);
      return {
        ...enemy,
        position: [newX, newY] as const,
      };
    });

    // Update all enemies at once
    updateEnemies(updatedEnemies);

    // Random firing logic
    const currentTime = Date.now();
    if (currentTime - lastFireTime.current > MISSILE_COOLDOWN) {
      if (Math.random() < 0.02 && enemies.length > 0) {
        const columns = new Map<
          number,
          { enemy: EnemyEntity; lowestY: number }
        >();

        for (const enemy of enemies) {
          const x = Math.round(enemy.position[0]);
          const y = enemy.position[1];
          const current = columns.get(x);
          if (!current || y > current.lowestY) {
            columns.set(x, { enemy, lowestY: y });
          }
        }

        const frontEnemies = Array.from(columns.values());
        if (frontEnemies.length > 0) {
          const shooter =
            frontEnemies[Math.floor(Math.random() * frontEnemies.length)];
          onMissileSpawn(shooter.enemy.position);
          lastFireTime.current = currentTime;
        }
      }
    }
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} entity={enemy} ref={getSpriteRef(enemy)} />
      ))}
    </>
  );
}
