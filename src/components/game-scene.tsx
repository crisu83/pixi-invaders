import { Container, useTick } from "@pixi/react";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  ENEMY_SIZE,
  MISSILE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
  STAGE_SIZE,
  PLAYER_SIZE,
} from "../constants";
import { Point } from "../types";
import { GameEntity } from "../types";
import { Player } from "./player";
import { EnemyGrid } from "./enemy-grid";
import { Missile } from "./missile";
import { Background } from "./background";
import { Explosion } from "./explosion";

export function GameScene() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const [playerMissiles, setPlayerMissiles] = useState<GameEntity[]>([]);
  const [playerPosition, setPlayerPosition] = useState<Point>([
    0,
    stageHeight / 3,
  ]);
  const [playerAlive, setPlayerAlive] = useState(true);
  const [playerExplosion, setPlayerExplosion] = useState<GameEntity | null>(
    null
  );

  const [enemies, setEnemies] = useState<GameEntity[]>([]);
  const [enemyMissiles, setEnemyMissiles] = useState<GameEntity[]>([]);
  const [enemyExplosions, setEnemyExplosions] = useState<GameEntity[]>([]);

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
    // Handle collisions between player missiles and enemies
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
          setEnemyExplosions((prev) => [
            ...prev,
            {
              id: nextEntityId.current++,
              position: enemy.position,
            },
          ]);
        }
      });
    });

    // Handle collisions between enemy missiles and player
    enemyMissiles.forEach((missile) => {
      const dx = Math.abs(missile.position[0] - playerPosition[0]);
      const dy = Math.abs(missile.position[1] - playerPosition[1]);

      if (
        dx < (PLAYER_SIZE[0] + MISSILE_SIZE[0]) / 2 &&
        dy < (PLAYER_SIZE[1] + MISSILE_SIZE[1]) / 2
      ) {
        setEnemyMissiles((prev) => prev.filter((m) => m.id !== missile.id));
        setPlayerAlive(false);
        setPlayerExplosion({
          id: nextEntityId.current++,
          position: playerPosition,
        });
      }
    });
  });

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
    setPlayerPosition((prev) => [prev[0], prev[1]]);
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
            onMove={(newPosition) => {
              setPlayerMissiles((prev) =>
                prev.map((m) =>
                  m.id === missile.id ? { ...m, position: newPosition } : m
                )
              );
            }}
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
            onMove={(newPosition) => {
              setEnemyMissiles((prev) =>
                prev.map((m) =>
                  m.id === missile.id ? { ...m, position: newPosition } : m
                )
              );
            }}
            onDestroy={() => {
              setEnemyMissiles((prev) =>
                prev.filter((m) => m.id !== missile.id)
              );
            }}
          />
        ))}
        {playerAlive && (
          <Player
            initialPosition={playerPosition}
            onMove={handlePlayerMove}
            onMissileSpawn={handleMissileSpawn}
          />
        )}
        {enemyExplosions.map((explosion) => (
          <Explosion
            key={explosion.id}
            position={explosion.position}
            texture="explosion_04.png"
            onFinish={() => {
              setEnemyExplosions((prev) =>
                prev.filter((e) => e.id !== explosion.id)
              );
            }}
          />
        ))}
        {playerExplosion && (
          <Explosion
            key={playerExplosion.id}
            position={playerExplosion.position}
            onFinish={() => setPlayerExplosion(null)}
          />
        )}
      </Container>
    </>
  );
}
