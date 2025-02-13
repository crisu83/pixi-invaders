import { Container, useTick } from "@pixi/react";
import { useRef } from "react";
import { Point, ENEMY_SIZE, ENEMY_SPEED, ENEMY_MARGIN } from "../constants";
import { Enemy } from "./enemy";
import { STAGE_SIZE } from "../constants";

interface EnemyGridProps {
  enemies: { id: number; position: Point }[];
  onEnemyDestroyed: () => void;
  onUpdateEnemies: (enemies: { id: number; position: Point }[]) => void;
}

export function EnemyGrid({
  enemies,
  onEnemyDestroyed,
  onUpdateEnemies,
}: EnemyGridProps) {
  const [stageWidth] = STAGE_SIZE;
  const enemyDirection = useRef(1);

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
  });

  return (
    <Container>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} initialPosition={enemy.position} />
      ))}
    </Container>
  );
}
