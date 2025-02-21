import { Container, useTick } from "@pixi/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { EnemyGrid } from "./enemy-grid";
import { Player } from "./player";
import { GameEntity, Point } from "../types";
import { useCollisionDetection } from "../hooks/use-collision-detection";
import {
  ENEMY_ROWS,
  ENEMY_SIZE,
  ENEMY_SPACING,
  ENEMIES_PER_ROW,
  MISSILE_SIZE,
  PLAYER_SIZE,
  STAGE_SIZE,
  MAX_TIME_BONUS,
  TIME_PENALTY_PER_SECOND,
} from "../constants";
import { createEntity } from "../utils/entity-factory";
import { getSpriteRef, setAlive } from "../utils/components";
import { Background } from "./background";
import { ExplosionGroup } from "./explosion-group";
import { MissileGroup } from "./missile-group";
import { PerformanceStats } from "./performance-stats";
import { ScoreText } from "./text";

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
  const [renderTick, setRenderTick] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const startTime = useRef<number>(0);

  const playerRef = useRef<GameEntity>(
    createEntity("PLAYER", [0, stageHeight / 3])
  );
  const enemiesRef = useRef<GameEntity[]>([]);
  const playerMissilesRef = useRef<GameEntity[]>([]);
  const enemyMissilesRef = useRef<GameEntity[]>([]);
  const explosionsRef = useRef<GameEntity[]>([]);
  const velocityRef = useRef<Point>([0, 0]);

  const updateRenderTick = useCallback(() => {
    setRenderTick((prev) => prev + 1);
  }, []);

  // Spawn initial enemies and start timer
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
    startTime.current = performance.now();
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
      const missile = createEntity("MISSILE", position, "ENEMY");
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

  // Handle stats toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Backquote") {
        setShowStats((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update game logic
  useTick(() => {
    if (!gameStarted) return;

    // Check for victory when all enemies are destroyed
    if (enemiesRef.current.length === 0) {
      // Calculate time bonus
      const gameTime = (performance.now() - startTime.current) / 1000;
      const timeBonus = Math.max(
        0,
        Math.round(MAX_TIME_BONUS - gameTime * TIME_PENALTY_PER_SECOND)
      );
      const finalScore = score + timeBonus;
      onVictory(finalScore);
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
          position={[-stageWidth / 2 + 20, -stageHeight / 2 + 15]}
        />
        <PerformanceStats
          renderTick={renderTick}
          position={[stageWidth / 2 - 20, -stageHeight / 2 + 15]}
          visible={showStats}
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
