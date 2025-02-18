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
import { createEntity } from "../../utils/entity-factory";
import { isAlive, setAlive } from "../../utils/entity";
import { ExplosionGroup } from "../explosion-group";

interface PlaySceneProps {
  onGameOver: () => void;
}

export function PlayScene({ onGameOver }: PlaySceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const checkCollision = useCollisionDetection();

  // Player state
  const [player, setPlayer] = useState(
    createEntity("PLAYER", [0, stageHeight / 3])
  );
  const [playerMissiles, setPlayerMissiles] = useState<GameEntity[]>([]);
  const [enemies, setEnemies] = useState<GameEntity[]>([]);
  const [enemyMissiles, setEnemyMissiles] = useState<GameEntity[]>([]);

  const velocityRef = useRef<Point>([0, 0]);

  // Explosion state
  const [explosions, setExplosions] = useState<GameEntity[]>([]);

  // Spawn initial enemies
  useEffect(() => {
    const newEnemies: GameEntity[] = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMIES_PER_ROW; col++) {
        const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
        const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
        newEnemies.push(createEntity("ENEMY", [x, y]));
      }
    }
    setEnemies(newEnemies);
  }, [stageHeight]);

  useTick(() => {
    // Check player missiles vs enemies
    for (const missile of playerMissiles) {
      for (const enemy of enemies) {
        if (checkCollision(missile, enemy, MISSILE_SIZE, ENEMY_SIZE)) {
          setPlayerMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          setExplosions((prev) => [...prev, enemy]);
          setEnemies((prev) => prev.filter((e) => e.id !== enemy.id));
          break;
        }
      }
    }

    // Only check enemy missiles if player is alive
    if (isAlive(player)) {
      for (const missile of enemyMissiles) {
        if (checkCollision(missile, player, MISSILE_SIZE, PLAYER_SIZE)) {
          setEnemyMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          setPlayer((prev) => setAlive(prev, false));
          setExplosions((prev) => [...prev, player]);

          // Wait for explosion animation to finish
          setTimeout(onGameOver, 1000);
          break;
        }
      }
    }
  });

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
    setPlayer((prev) => {
      const [x, y] = prev.position;
      return { ...prev, position: [x + velocity[0], y] };
    });
  }, []);

  const handlePlayerMissileSpawn = useCallback(
    (position: Point) => {
      setPlayerMissiles([...playerMissiles, createEntity("MISSILE", position)]);
    },
    [playerMissiles]
  );

  const handleEnemyMissileSpawn = useCallback(
    (position: Point) => {
      setEnemyMissiles([...enemyMissiles, createEntity("MISSILE", position)]);
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
          initialPosition={player.position}
          onMove={handlePlayerMove}
          onMissileSpawn={handlePlayerMissileSpawn}
          alive={isAlive(player)}
        />
        <ExplosionGroup explosions={explosions} setExplosions={setExplosions} />
      </Container>
    </>
  );
}
