import { Container, useTick } from "@pixi/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { EnemyGrid } from "./enemy-grid";
import { Player } from "./player";
import { GameEntity, Point } from "../types";
import { useCollisionDetection } from "../hooks/use-collision-detection";
import {
  STAGE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
  MISSILE_SIZE,
  ENEMY_SIZE,
  PLAYER_SIZE,
} from "../constants";
import { Background } from "./background";
import { createEntity } from "../utils/entity-factory";
import { getSpriteRef, setAlive } from "../utils/components";
import { ScoreText } from "./text";
import { MissileGroup } from "./missile-group";
import { ExplosionGroup } from "./explosion-group";

export function PlayScene({
  onGameOver,
  onVictory,
}: {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
}) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const checkCollision = useCollisionDetection();

  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [, setRenderTick] = useState(0);

  const playerRef = useRef<GameEntity>(
    createEntity("PLAYER", [0, stageHeight / 3])
  );
  const enemiesRef = useRef<GameEntity[]>([]);
  const explosionsRef = useRef<GameEntity[]>([]);
  const velocityRef = useRef<Point>([0, 0]);
  const playerMissilesRef = useRef<GameEntity[]>([]);
  const enemyMissilesRef = useRef<GameEntity[]>([]);

  const updateRenderTick = useCallback(() => {
    setRenderTick((prev) => prev + 1);
  }, []);

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
    enemiesRef.current = newEnemies;
    setGameStarted(true);
  }, [stageHeight]);

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
  }, []);

  const handlePlayerMissileSpawn = useCallback(
    (position: Point) => {
      const missile = createEntity("MISSILE", position);
      playerMissilesRef.current = [...playerMissilesRef.current, missile];
      updateRenderTick();
    },
    [updateRenderTick]
  );

  const handleEnemyMissileSpawn = useCallback(
    (position: Point) => {
      const missile = createEntity("MISSILE", position);
      enemyMissilesRef.current = [...enemyMissilesRef.current, missile];
      updateRenderTick();
    },
    [updateRenderTick]
  );

  const handlePlayerMissileDestroy = useCallback(
    (missileId: number) => {
      playerMissilesRef.current = playerMissilesRef.current.filter(
        (m) => m.id !== missileId
      );
      updateRenderTick();
    },
    [updateRenderTick]
  );

  const handleEnemyMissileDestroy = useCallback(
    (missileId: number) => {
      enemyMissilesRef.current = enemyMissilesRef.current.filter(
        (m) => m.id !== missileId
      );
      updateRenderTick();
    },
    [updateRenderTick]
  );

  const handleExplosionComplete = useCallback(
    (explosionId: number) => {
      explosionsRef.current = explosionsRef.current.filter(
        (e) => e.id !== explosionId
      );
      updateRenderTick();
    },
    [updateRenderTick]
  );

  const handlePlayerDeath = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);

    const sprite = getSpriteRef(playerRef.current).current;
    if (sprite) {
      playerRef.current = setAlive(playerRef.current, false);
      const explosion = createEntity("EXPLOSION", [sprite.x, sprite.y]);
      explosionsRef.current = [...explosionsRef.current, explosion];
      updateRenderTick();
      setTimeout(() => onGameOver(score), 1000);
    }
  }, [onGameOver, score, gameOver, updateRenderTick]);

  useTick(() => {
    if (!gameStarted) return;

    // Check for victory when all enemies are destroyed
    if (enemiesRef.current.length === 0) {
      onVictory(score);
      return;
    }

    // Check if enemies have reached the player's height
    const sprite = getSpriteRef(playerRef.current).current;
    if (!sprite) return;

    if (
      enemiesRef.current.some((enemy) => {
        const enemySprite = getSpriteRef(enemy).current;
        return enemySprite && enemySprite.y >= sprite.y;
      })
    ) {
      handlePlayerDeath();
      return;
    }

    // Check player missiles vs enemies
    for (const missile of playerMissilesRef.current) {
      for (const enemy of enemiesRef.current) {
        if (checkCollision(missile, enemy, MISSILE_SIZE, ENEMY_SIZE)) {
          handlePlayerMissileDestroy(missile.id);
          const sprite = getSpriteRef(enemy).current;
          if (sprite) {
            enemiesRef.current = enemiesRef.current.filter(
              (e) => e.id !== enemy.id
            );
            const explosion = createEntity(
              "EXPLOSION",
              [sprite.x, sprite.y],
              "ENEMY"
            );
            explosionsRef.current = [...explosionsRef.current, explosion];
            updateRenderTick();
            setScore((prev) => prev + 100);
          }
          break;
        }
      }
    }

    // Check enemy missiles vs player
    for (const missile of enemyMissilesRef.current) {
      if (
        checkCollision(missile, playerRef.current, MISSILE_SIZE, PLAYER_SIZE)
      ) {
        handleEnemyMissileDestroy(missile.id);
        handlePlayerDeath();
        break;
      }
    }
  });

  return (
    <>
      <Container>
        <Background velocityRef={velocityRef} />
      </Container>
      <Container position={[stageWidth / 2, stageHeight / 2]}>
        <ScoreText
          value={score}
          position={[-stageWidth / 2 + 20, -stageHeight / 2 + 20]}
        />
        <Player
          entity={playerRef.current}
          onMove={handlePlayerMove}
          onMissileSpawn={handlePlayerMissileSpawn}
          ref={getSpriteRef(playerRef.current)}
        />
        <EnemyGrid
          enemies={enemiesRef.current}
          onMissileSpawn={handleEnemyMissileSpawn}
        />
        <MissileGroup
          playerMissiles={playerMissilesRef.current}
          enemyMissiles={enemyMissilesRef.current}
          onPlayerMissileDestroy={handlePlayerMissileDestroy}
          onEnemyMissileDestroy={handleEnemyMissileDestroy}
        />
        <ExplosionGroup
          explosions={explosionsRef.current}
          onExplosionComplete={handleExplosionComplete}
        />
      </Container>
    </>
  );
}
