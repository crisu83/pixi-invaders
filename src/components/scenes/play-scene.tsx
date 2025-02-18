import { Container, useTick } from "@pixi/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { EnemyGrid } from "../enemy-grid";
import { MissileGroup } from "../missile-group";
import { Player } from "../player";
import { GameEntity, Point } from "../../types";
import { useCollisionDetection } from "../../hooks/use-collision-detection";
import {
  STAGE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
  MISSILE_SIZE,
  ENEMY_SIZE,
  PLAYER_SIZE,
} from "../../constants";
import { Background } from "../background";

interface PlaySceneProps {
  onGameOver: () => void;
}

export function PlayScene({ onGameOver }: PlaySceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const nextEntityId = useRef(0);
  const checkCollision = useCollisionDetection();

  // Player state
  const [playerMissiles, setPlayerMissiles] = useState<GameEntity[]>([]);
  const [playerPosition, setPlayerPosition] = useState<Point>([
    0,
    stageHeight / 3,
  ]);
  const [playerAlive, setPlayerAlive] = useState(true);

  // Enemy state
  const [enemies, setEnemies] = useState<GameEntity[]>([]);
  const [enemyMissiles, setEnemyMissiles] = useState<GameEntity[]>([]);

  const velocityRef = useRef<Point>([0, 0]);

  const createEntity = (position: Point): GameEntity => ({
    id: nextEntityId.current++,
    position,
  });

  // Spawn initial enemies
  useEffect(() => {
    const newEnemies: GameEntity[] = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMIES_PER_ROW; col++) {
        const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
        const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
        newEnemies.push(createEntity([x, y]));
      }
    }
    setEnemies(newEnemies);
  }, [stageHeight]);

  useTick(() => {
    // Check player missiles vs enemies
    for (const missile of playerMissiles) {
      for (const enemy of enemies) {
        // Skip dead enemies
        if (enemy.alive === false) continue;

        if (checkCollision(missile, enemy, MISSILE_SIZE, ENEMY_SIZE)) {
          setPlayerMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          setEnemies((prev) =>
            prev.map((e) => (e.id === enemy.id ? { ...e, alive: false } : e))
          );
          break;
        }
      }
    }

    // Only check enemy missiles if player is alive
    if (playerAlive) {
      for (const missile of enemyMissiles) {
        if (
          checkCollision(
            missile,
            { id: -1, position: playerPosition },
            MISSILE_SIZE,
            PLAYER_SIZE
          )
        ) {
          setEnemyMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          setPlayerAlive(false);
          break;
        }
      }
    }
  });

  const handlePlayerMove = useCallback(
    (velocity: Point) => {
      velocityRef.current = velocity;
      setPlayerPosition(playerPosition);
    },
    [playerPosition]
  );

  const handlePlayerMissileSpawn = useCallback(
    (position: Point) => {
      setPlayerMissiles([...playerMissiles, createEntity(position)]);
    },
    [playerMissiles]
  );

  const handleEnemyMissileSpawn = useCallback(
    (position: Point) => {
      setEnemyMissiles([...enemyMissiles, createEntity(position)]);
    },
    [enemyMissiles]
  );

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
          onEnemyDestroy={(id) => {
            setEnemies((prev) => prev.filter((e) => e.id !== id));
          }}
        />
        <MissileGroup
          missiles={playerMissiles}
          setMissiles={setPlayerMissiles}
          direction={[0, -1]}
          texture="missile_01.png"
        />
        <MissileGroup
          missiles={enemyMissiles}
          setMissiles={setEnemyMissiles}
          direction={[0, 1]}
          texture="missile_02.png"
        />
        <Player
          initialPosition={playerPosition}
          onMove={handlePlayerMove}
          onMissileSpawn={handlePlayerMissileSpawn}
          alive={playerAlive}
          onDestroy={onGameOver}
        />
      </Container>
    </>
  );
}
