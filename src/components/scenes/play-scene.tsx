import { Container, useTick } from "@pixi/react";
import { useCallback, useEffect } from "react";
import { DebugOverlay } from "@/components/debug/debug-overlay";
import { EnemyGrid } from "@/components/entities/enemy-grid";
import { ExplosionGroup } from "@/components/entities/explosion-group";
import { MissileGroup } from "@/components/entities/missile-group";
import { Player } from "@/components/entities/player";
import { Background } from "@/components/ui/background";
import { PerformanceStats } from "@/components/ui/performance-stats";
import { MuteIndicator } from "@/components/ui/text";
import { ComboText, ScoreText } from "@/components/ui/text";
import { STAGE_SIZE } from "@/constants";
import { useAudioStore } from "@/stores/audio-store";
import { useDebugStore } from "@/stores/debug-store";
import { useEnemyStore } from "@/stores/enemy-store";
import { useExplosionStore } from "@/stores/explosion-store";
import { useGameStore } from "@/stores/game-store";
import { useInputStore } from "@/stores/input-store";
import { useMissileStore } from "@/stores/missile-store";
import { usePlayerStore } from "@/stores/player-store";
import { useScoreStore } from "@/stores/score-store";
import { EnemyEntity, Point } from "@/types";
import { useCollisionChecker } from "@/utils/collision-checker";
import { createEntity } from "@/utils/entity-factory";
import { getSpriteRef } from "@/utils/entity-helpers";

type PlaySceneProps = {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
};

export function PlayScene({ onGameOver, onVictory }: PlaySceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  // Game state from Zustand
  const { gameStarted, gameOver, endGame, startGame } = useGameStore();
  const { score, combo, addScore, resetScore } = useScoreStore();
  const { explosions, addExplosion, removeExplosion, resetExplosions } =
    useExplosionStore();
  const { missiles, addMissile, removeMissile, resetMissiles } =
    useMissileStore();
  const { enemies, removeEnemy, resetEnemies } = useEnemyStore();
  const { player, resetPlayer, removePlayer } = usePlayerStore();

  const {
    checkMissileEnemyCollisions,
    checkMissilePlayerCollisions,
    checkEnemyPlayerCollisions,
    resetCollisionChecks,
  } = useCollisionChecker();

  const { showStats, toggleStats } = useDebugStore();
  const onToggle = useInputStore((state) => state.onToggle);
  const { playMusic, stopMusic, muted, toggleMuted } = useAudioStore();

  // Initialize the game
  useEffect(() => {
    resetScore();
    resetPlayer();
    resetEnemies();
    resetMissiles();
    resetExplosions();
    startGame();
  }, [
    resetScore,
    resetPlayer,
    resetEnemies,
    resetMissiles,
    resetExplosions,
    startGame,
  ]);

  // Play music when scene mounts, stop when unmounting
  useEffect(() => {
    playMusic();
    return () => stopMusic();
  }, [playMusic, stopMusic]);

  // Handle toggles
  useEffect(() => {
    return onToggle((action) => {
      switch (action) {
        case "TOGGLE_STATS":
          toggleStats();
          break;
        case "TOGGLE_MUSIC":
          toggleMuted();
          break;
      }
    });
  }, [onToggle, toggleStats, toggleMuted]);

  const handlePlayerMissileSpawn = useCallback(
    (position: Point) => {
      const missile = createEntity("PLAYER_MISSILE", position);
      addMissile(missile);
    },
    [addMissile]
  );

  const handleEnemyMissileSpawn = useCallback(
    (position: Point) => {
      const missile = createEntity("ENEMY_MISSILE", position);
      addMissile(missile);
    },
    [addMissile]
  );

  const handleMissileDestroy = useCallback(
    (missileId: number) => {
      removeMissile(missileId);
    },
    [removeMissile]
  );

  const handleExplosionComplete = useCallback(
    (explosionId: number) => {
      removeExplosion(explosionId);
    },
    [removeExplosion]
  );

  const handlePlayerDeath = useCallback(() => {
    if (!player) return;
    endGame();
    const explosion = createEntity("PLAYER_EXPLOSION", player.position);
    removePlayer();
    addExplosion(explosion);
    setTimeout(() => onGameOver(score), 1000);
  }, [onGameOver, score, player, removePlayer, addExplosion, endGame]);

  const handleEnemyDeath = useCallback(
    (enemy: EnemyEntity) => {
      removeEnemy(enemy.id);
      const explosion = createEntity("ENEMY_EXPLOSION", enemy.position);
      addExplosion(explosion);
      addScore(100);
    },
    [addExplosion, addScore, removeEnemy]
  );

  // Update game logic
  useTick(() => {
    if (!gameStarted || gameOver) return;

    // Check for victory when all enemies are destroyed
    if (enemies.length === 0) {
      setTimeout(() => onVictory(score), 1000);
      return;
    }

    if (!player) return;

    // Reset collision checks at the start of each tick
    resetCollisionChecks();

    // Check collisions
    const enemyCollision = checkEnemyPlayerCollisions();
    const missileCollision = checkMissilePlayerCollisions();
    if (enemyCollision.collision || missileCollision.collision) {
      if (missileCollision.collision && missileCollision.entity1) {
        removeMissile(missileCollision.entity1.id);
      }
      handlePlayerDeath();
      return;
    }

    const missileHit = checkMissileEnemyCollisions();
    if (missileHit.collision && missileHit.entity1 && missileHit.entity2) {
      const missile = missileHit.entity1;
      const enemy = missileHit.entity2;
      removeMissile(missile.id);
      handleEnemyDeath(enemy);
    }
  });

  return (
    <>
      <Container>
        <Background />
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
        <MuteIndicator
          position={[stageWidth / 2 - 20, stageHeight / 2 - 40]}
          visible={muted}
        />
        <PerformanceStats
          position={[stageWidth / 2 - 20, -stageHeight / 2 + 15]}
          visible={showStats}
        />
        {player && (
          <Player
            entity={player}
            onMissileSpawn={handlePlayerMissileSpawn}
            ref={getSpriteRef(player)}
          />
        )}
        <EnemyGrid enemies={enemies} onMissileSpawn={handleEnemyMissileSpawn} />
        <MissileGroup
          missiles={missiles}
          onMissileDestroy={handleMissileDestroy}
        />
        <ExplosionGroup
          explosions={explosions}
          onExplosionComplete={handleExplosionComplete}
        />
        <DebugOverlay
          player={player}
          enemies={enemies}
          missiles={missiles}
          explosions={explosions}
        />
      </Container>
    </>
  );
}
