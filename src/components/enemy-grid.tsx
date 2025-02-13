import { Container, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import {
  ENEMY_SIZE,
  ENEMY_SPEED,
  ENEMY_MARGIN,
  MISSILE_COOLDOWN,
  MISSILE_SIZE,
} from "../constants";
import { Enemy } from "./enemy";
import { STAGE_SIZE } from "../constants";
import { Missile } from "./missile";
import { GameEntity, Point } from "../types";

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
  const [missiles, setMissiles] = useState<GameEntity[]>([]);
  const lastFireTime = useRef(0);
  const nextMissileId = useRef(0);

  useTick((delta) => {
    // Handle enemy movement
    const moveAmount = ENEMY_SPEED * delta * enemyDirection.current;
    let needsToMoveDown = false;

    const wouldHitBoundary = enemies.some((enemy) => {
      const newX = enemy.position[0] + moveAmount;
      return Math.abs(newX) > (stageWidth - ENEMY_MARGIN * 2) / 2;
    });

    if (wouldHitBoundary) {
      enemyDirection.current *= -1;
      needsToMoveDown = true;
    }

    onUpdateEnemies(
      enemies.map((enemy) => ({
        ...enemy,
        position: [
          enemy.position[0] + (wouldHitBoundary ? 0 : moveAmount),
          enemy.position[1] + (needsToMoveDown ? ENEMY_SIZE[1] : 0),
        ] as Point,
      }))
    );

    // Handle collisions
    missiles.forEach((missile) => {
      enemies.forEach((enemy) => {
        const dx = Math.abs(missile.position[0] - enemy.position[0]);
        const dy = Math.abs(missile.position[1] - enemy.position[1]);

        if (
          dx < (ENEMY_SIZE[0] + MISSILE_SIZE[0]) / 2 &&
          dy < (ENEMY_SIZE[1] + MISSILE_SIZE[1]) / 2
        ) {
          // Assuming onEnemyDestroyed is called elsewhere in the code
          // onEnemyDestroyed(enemy.id);
          // onMissileDestroyed(missile.id);
        }
      });
    });

    // Random firing logic
    const currentTime = Date.now();
    if (currentTime - lastFireTime.current > MISSILE_COOLDOWN) {
      // 2% chance to fire per tick when cooldown is ready
      if (Math.random() < 0.02 && enemies.length > 0) {
        // Find frontmost enemies in each column
        const columns = new Map<number, { position: Point; lowestY: number }>();
        enemies.forEach((enemy) => {
          const x = Math.round(enemy.position[0]); // Round to handle floating point
          const current = columns.get(x);
          if (!current || enemy.position[1] > current.lowestY) {
            columns.set(x, {
              position: enemy.position,
              lowestY: enemy.position[1],
            });
          }
        });

        // Randomly select one of the frontmost enemies to fire
        const frontEnemies = Array.from(columns.values());
        if (frontEnemies.length > 0) {
          const shooter =
            frontEnemies[Math.floor(Math.random() * frontEnemies.length)];
          onMissileSpawn(shooter.position);
          setMissiles((prev) => [
            ...prev,
            {
              id: nextMissileId.current++,
              position: shooter.position,
            },
          ]);
          lastFireTime.current = currentTime;
        }
      }
    }
  });

  return (
    <Container>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} initialPosition={enemy.position} />
      ))}
      {missiles.map((missile) => (
        <Missile
          key={missile.id}
          initialPosition={missile.position}
          direction={[0, 1]}
          texture="missile_02.png"
          onDestroy={() => {
            setMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          }}
        />
      ))}
    </Container>
  );
}
