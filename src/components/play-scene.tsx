import { Container, useTick } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import {
  STAGE_SIZE,
  MAX_TIME_BONUS,
  TIME_PENALTY_PER_SECOND,
} from "../constants";
import { Point } from "../types";
import { useGameStore } from "../stores/game-store";
import { useCollisionSystem } from "../systems/collision-system";
import { getSpriteRef, setAlive } from "../utils/components";
import { createEntity } from "../utils/entity-factory";
import { Background } from "./background";
import { EnemyGrid } from "./enemy-grid";
import { ExplosionGroup } from "./explosion-group";
import { MissileGroup } from "./missile-group";
import { Player } from "./player";
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
    addScore,
  } = useGameStore();

  const {
    checkMissileEnemyCollisions,
    checkMissilePlayerCollisions,
    checkEnemyPlayerCollisions,
  } = useCollisionSystem();

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

    // Check collisions
    const enemyCollision = checkEnemyPlayerCollisions();
    const missileCollision = checkMissilePlayerCollisions();
    if (enemyCollision.collision || missileCollision.collision) {
      if (missileCollision.collision && missileCollision.entity1) {
        removeEnemyMissile(missileCollision.entity1.id);
      }
      handlePlayerDeath();
      return;
    }

    const missileHit = checkMissileEnemyCollisions();
    if (missileHit.collision && missileHit.entity1 && missileHit.entity2) {
      const { entity1: missile, entity2: enemy } = missileHit;
      removePlayerMissile(missile.id);
      const sprite = getSpriteRef(enemy).current;
      if (sprite) {
        removeEnemy(enemy.id);
        const explosion = createEntity(
          "EXPLOSION",
          [sprite.x, sprite.y],
          "ENEMY"
        );
        addExplosion(explosion);
        addScore(100);
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
