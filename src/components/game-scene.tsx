import { Container, useTick } from "@pixi/react";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  ENEMY_SIZE,
  MISSILE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
  STAGE_SIZE,
} from "../constants";
import { Point } from "../types";
import { GameEntity } from "../types";
import { Player } from "./player";
import { EnemyGrid } from "./enemy-grid";
import { Missile } from "./missile";
import { Background } from "./background";

export function GameScene() {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const [enemies, setEnemies] = useState<GameEntity[]>([]);
  const [playerMissiles, setPlayerMissiles] = useState<GameEntity[]>([]);
  const [enemyMissiles, setEnemyMissiles] = useState<GameEntity[]>([]);
  const velocityRef = useRef<Point>([0, 0]);
  const nextEntityId = useRef(0);

  // Spawn initial enemies
  useEffect(() => {
    const newEnemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMIES_PER_ROW; col++) {
        const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
        const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
        newEnemies.push({
          id: nextEntityId.current++,
          position: [x, y] as Point,
        });
      }
    }
    setEnemies(newEnemies);
  }, [stageHeight]);

  // Game logic handlers
  useTick(() => {
    // Handle collisions
    playerMissiles.forEach((missile) => {
      enemies.forEach((enemy) => {
        const dx = Math.abs(missile.position[0] - enemy.position[0]);
        const dy = Math.abs(missile.position[1] - enemy.position[1]);

        if (
          dx < (ENEMY_SIZE[0] + MISSILE_SIZE[0]) / 2 &&
          dy < (ENEMY_SIZE[1] + MISSILE_SIZE[1]) / 2
        ) {
          setPlayerMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          setEnemies((prev) => prev.filter((e) => e.id !== enemy.id));
        }
      });
    });
  });

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
  }, []);

  const handleMissileSpawn = useCallback((position: Point) => {
    setPlayerMissiles((prev) => [
      ...prev,
      {
        id: nextEntityId.current++,
        position,
      },
    ]);
  }, []);

  const handleEnemyMissileSpawn = useCallback((position: Point) => {
    setEnemyMissiles((prev) => [
      ...prev,
      {
        id: nextEntityId.current++,
        position,
      },
    ]);
  }, []);

  return (
    <>
      <Container>
        <Background velocityRef={velocityRef} />
      </Container>
      <Container position={[stageWidth / 2, stageHeight / 2]}>
        <EnemyGrid
          enemies={enemies}
          onUpdateEnemies={setEnemies}
          onMissileSpawn={handleEnemyMissileSpawn}
        />
        {playerMissiles.map((missile) => (
          <Missile
            key={missile.id}
            initialPosition={missile.position}
            onDestroy={() => {
              setPlayerMissiles((prev) =>
                prev.filter((m) => m.id !== missile.id)
              );
            }}
          />
        ))}
        {enemyMissiles.map((missile) => (
          <Missile
            key={missile.id}
            initialPosition={missile.position}
            direction={[0, 1]}
            texture="missile_02.png"
            onDestroy={() => {
              setEnemyMissiles((prev) =>
                prev.filter((m) => m.id !== missile.id)
              );
            }}
          />
        ))}
        <Player
          initialPosition={[0, stageHeight / 3]}
          onMove={handlePlayerMove}
          onMissileSpawn={handleMissileSpawn}
        />
      </Container>
    </>
  );
}
