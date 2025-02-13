import { Container, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import {
  Point,
  ENEMY_SIZE,
  ENEMY_SPEED,
  ENEMY_MARGIN,
  MISSILE_COOLDOWN,
} from "../constants";
import { Enemy } from "./enemy";
import { STAGE_SIZE } from "../constants";
import { Missile } from "./missile";

interface EnemyGridProps {
  enemies: { id: number; position: Point }[];
  onEnemyDestroyed: () => void;
  onUpdateEnemies: (enemies: { id: number; position: Point }[]) => void;
}

// Add missile interface
interface EnemyMissile {
  id: number;
  position: Point;
}

export function EnemyGrid({
  enemies,
  onEnemyDestroyed,
  onUpdateEnemies,
}: EnemyGridProps) {
  const [stageWidth] = STAGE_SIZE;
  const enemyDirection = useRef(1);
  const [missiles, setMissiles] = useState<EnemyMissile[]>([]);
  const lastFireTime = useRef(0);
  const nextMissileId = useRef(0);

  useTick((delta) => {
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

    onEnemyDestroyed();

    onUpdateEnemies(
      enemies.map((enemy) => ({
        ...enemy,
        position: [
          enemy.position[0] + (wouldHitBoundary ? 0 : moveAmount),
          enemy.position[1] + (needsToMoveDown ? ENEMY_SIZE[1] : 0),
        ] as Point,
      }))
    );

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
