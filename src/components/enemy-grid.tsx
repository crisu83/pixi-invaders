import { Container, useTick } from "@pixi/react";
import { useCallback, useRef } from "react";
import {
  ENEMY_SPACING,
  ENEMY_SPEED,
  MISSILE_COOLDOWN,
  STAGE_MARGIN,
 STAGE_SIZE } from "../constants";
import { useAudioStore } from "../stores/audio-store";
import { GameEntity, Point } from "../types";
import { getSpriteRef, isAlive } from "../utils/components";
import { Enemy } from "./enemy";

type EnemyGridProps = {
  enemies: GameEntity[];
  onMissileSpawn: (position: Point) => void;
};

export function EnemyGrid({ enemies, onMissileSpawn }: EnemyGridProps) {
  const [stageWidth] = STAGE_SIZE;

  const lastFireTime = useRef(0);
  const enemyDirection = useRef(1);
  const enemyPositions = useRef<Map<number, Point>>(new Map());
  const playSound = useAudioStore((state) => state.playSound);

  const handleMissileSpawn = useCallback(
    (position: Point) => {
      onMissileSpawn(position);
      playSound("MISSILE_2");
    },
    [onMissileSpawn, playSound]
  );

  useTick((delta) => {
    const moveAmount = ENEMY_SPEED * delta * enemyDirection.current;
    let needsToMoveDown = false;

    // Only check boundary collisions for alive enemies
    const wouldHitBoundary = enemies.some((enemy) => {
      const position = enemyPositions.current.get(enemy.id);
      if (!isAlive(enemy) || !position) return false;
      const newX = position[0] + moveAmount;
      return Math.abs(newX) > (stageWidth - STAGE_MARGIN * 2) / 2;
    });

    if (wouldHitBoundary) {
      enemyDirection.current *= -1;
      needsToMoveDown = true;
    }

    // Update enemy positions
    enemies.forEach((enemy) => {
      if (!isAlive(enemy)) return;
      const sprite = getSpriteRef(enemy).current;
      if (!sprite) return;

      const newX =
        sprite.x +
        (needsToMoveDown ? 0 : ENEMY_SPEED * delta * enemyDirection.current);
      const newY = sprite.y + (needsToMoveDown ? ENEMY_SPACING[1] : 0);

      sprite.x = newX;
      sprite.y = newY;

      enemyPositions.current.set(enemy.id, [newX, newY]);
    });

    // Random firing logic
    const currentTime = Date.now();
    if (currentTime - lastFireTime.current > MISSILE_COOLDOWN) {
      if (Math.random() < 0.02 && enemies.length > 0) {
        const columns = new Map<number, { position: Point; lowestY: number }>();

        // Only consider alive enemies
        for (const enemy of enemies.filter(isAlive)) {
          const position = enemyPositions.current.get(enemy.id);
          if (!position) continue;
          const x = Math.round(position[0]);
          const y = position[1];
          const current = columns.get(x);
          if (!current || y > current.lowestY) {
            columns.set(x, { position, lowestY: y });
          }
        }

        const frontEnemies = Array.from(columns.values());
        if (frontEnemies.length > 0) {
          const shooter =
            frontEnemies[Math.floor(Math.random() * frontEnemies.length)];
          handleMissileSpawn(shooter.position);
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
