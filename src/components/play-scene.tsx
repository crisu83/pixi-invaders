import { Container, useTick } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { STAGE_SIZE } from "../constants";
import { Point } from "../types";
import { useGameStore } from "../stores/game-store";
import { useScoreStore } from "../stores/score-store";
import { useExplosionStore } from "../stores/explosion-store";
import { useCollisionSystem } from "../systems/collision-system";
import { getSpriteRef, setAlive } from "../utils/components";
import { createEntity } from "../utils/entity-factory";
import { Background } from "./background";
import { EnemyGrid } from "./enemy-grid";
import { ExplosionGroup } from "./explosion-group";
import { MissileGroup } from "./missile-group";
import { Player } from "./player";
import { PerformanceStats } from "./performance-stats";
import { ScoreText, ComboText } from "./text";

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
    gameStarted,
    gameOver,
    player,
    enemies,
    playerMissiles,
    enemyMissiles,
    velocity,
    setGameOver,
    updatePlayer,
    addPlayerMissile,
    addEnemyMissile,
    removePlayerMissile,
    removeEnemyMissile,
    removeEnemy,
    setVelocity,
    initializeGame,
  } = useGameStore();

  const { score, combo, addScore, resetScore } = useScoreStore();
  const { explosions, addExplosion, removeExplosion, resetExplosions } =
    useExplosionStore();

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
    resetScore();
    resetExplosions();
  }, [initializeGame, resetScore, resetExplosions]);

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
      onVictory(score);
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
        <ComboText
          combo={combo}
          position={[-stageWidth / 2 + 20, -stageHeight / 2 + 45]}
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
