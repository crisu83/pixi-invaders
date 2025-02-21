import { Container, useTick } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { EnemyGrid } from "./enemy-grid";
import { Player } from "./player";
import { Point } from "../types";
import { useCollisionDetection } from "../hooks/use-collision-detection";
import {
  ENEMY_SIZE,
  MISSILE_SIZE,
  PLAYER_SIZE,
  STAGE_SIZE,
  MAX_TIME_BONUS,
  TIME_PENALTY_PER_SECOND,
} from "../constants";
import { useGameStore } from "../stores/game-store";
import { Background } from "./background";
import { createEntity } from "../utils/entity-factory";
import { getSpriteRef, setAlive } from "../utils/components";
import { ScoreText } from "./text";
import { MissileGroup } from "./missile-group";
import { ExplosionGroup } from "./explosion-group";
import { PerformanceStats } from "./performance-stats";

export function PlayScene({
  onGameOver,
  onVictory,
}: {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
}) {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const checkCollision = useCollisionDetection();

  // Game state from Zustand
  const {
    score,
    gameStarted,
    gameOver,
    startTime,
    player,
    enemies,
    playerMissiles,
    enemyMissiles,
    explosions,
    velocity,
    setScore,
    setGameOver,
    updatePlayer,
    addPlayerMissile,
    addEnemyMissile,
    addExplosion,
    removePlayerMissile,
    removeEnemyMissile,
    removeExplosion,
    removeEnemy,
    setVelocity,
    initializeGame,
  } = useGameStore();

  const [renderTick, setRenderTick] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(false);

  const updateRenderTick = useCallback(() => {
    setRenderTick((prev: number) => prev + 1);
  }, []);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handlePlayerMove = useCallback(
    (velocity: Point) => {
      setVelocity(velocity);
    },
    [setVelocity]
  );

  const handlePlayerMissileSpawn = useCallback(
    (position: Point) => {
      const missile = createEntity("MISSILE", position);
      addPlayerMissile(missile);
      updateRenderTick();
    },
    [addPlayerMissile, updateRenderTick]
  );

  const handleEnemyMissileSpawn = useCallback(
    (position: Point) => {
      const missile = createEntity("MISSILE", position, "ENEMY");
      addEnemyMissile(missile);
      updateRenderTick();
    },
    [addEnemyMissile, updateRenderTick]
  );

  const handlePlayerMissileDestroy = useCallback(
    (missileId: number) => {
      removePlayerMissile(missileId);
      updateRenderTick();
    },
    [removePlayerMissile, updateRenderTick]
  );

  const handleEnemyMissileDestroy = useCallback(
    (missileId: number) => {
      removeEnemyMissile(missileId);
      updateRenderTick();
    },
    [removeEnemyMissile, updateRenderTick]
  );

  const handleExplosionComplete = useCallback(
    (explosionId: number) => {
      removeExplosion(explosionId);
      updateRenderTick();
    },
    [removeExplosion, updateRenderTick]
  );

  const handlePlayerDeath = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);

    const sprite = getSpriteRef(player).current;
    if (sprite) {
      updatePlayer(setAlive(player, false));
      const explosion = createEntity("EXPLOSION", [sprite.x, sprite.y]);
      addExplosion(explosion);
      updateRenderTick();
      setTimeout(() => onGameOver(score), 1000);
    }
  }, [
    onGameOver,
    score,
    gameOver,
    player,
    updatePlayer,
    addExplosion,
    setGameOver,
    updateRenderTick,
  ]);

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
    if (enemies.length === 0) {
      // Calculate time bonus
      const gameTime = (performance.now() - startTime) / 1000;
      const timeBonus = Math.max(
        0,
        Math.round(MAX_TIME_BONUS - gameTime * TIME_PENALTY_PER_SECOND)
      );
      const finalScore = score + timeBonus;
      onVictory(finalScore);
      return;
    }

    // Check if enemies have reached the player's height
    const sprite = getSpriteRef(player).current;
    if (!sprite) return;

    if (
      enemies.some((enemy) => {
        const enemySprite = getSpriteRef(enemy).current;
        return enemySprite && enemySprite.y >= sprite.y;
      })
    ) {
      handlePlayerDeath();
      return;
    }

    // Check player missiles vs enemies
    for (const missile of playerMissiles) {
      for (const enemy of enemies) {
        if (checkCollision(missile, enemy, MISSILE_SIZE, ENEMY_SIZE)) {
          handlePlayerMissileDestroy(missile.id);
          const sprite = getSpriteRef(enemy).current;
          if (sprite) {
            removeEnemy(enemy.id);
            const explosion = createEntity(
              "EXPLOSION",
              [sprite.x, sprite.y],
              "ENEMY"
            );
            addExplosion(explosion);
            updateRenderTick();
            setScore(score + 100);
          }
          break;
        }
      }
    }

    // Check enemy missiles vs player
    for (const missile of enemyMissiles) {
      if (checkCollision(missile, player, MISSILE_SIZE, PLAYER_SIZE)) {
        handleEnemyMissileDestroy(missile.id);
        handlePlayerDeath();
        break;
      }
    }
  });

  return (
    <>
      <Container>
        <Background velocityRef={{ current: velocity }} />
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
          entity={player}
          onMove={handlePlayerMove}
          onMissileSpawn={handlePlayerMissileSpawn}
          ref={getSpriteRef(player)}
        />
        <EnemyGrid enemies={enemies} onMissileSpawn={handleEnemyMissileSpawn} />
        <MissileGroup
          playerMissiles={playerMissiles}
          enemyMissiles={enemyMissiles}
          onPlayerMissileDestroy={handlePlayerMissileDestroy}
          onEnemyMissileDestroy={handleEnemyMissileDestroy}
        />
        <ExplosionGroup
          explosions={explosions}
          onExplosionComplete={handleExplosionComplete}
        />
      </Container>
    </>
  );
}
