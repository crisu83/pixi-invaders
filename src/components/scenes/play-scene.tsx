import { Container, useTick } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { EnemyGrid } from "@/components/entities/enemy-grid";
import { ExplosionGroup } from "@/components/entities/explosion-group";
import { MissileGroup } from "@/components/entities/missile-group";
import { Player } from "@/components/entities/player";
import { Background } from "@/components/ui/background";
import { MuteIndicator } from "@/components/ui/mute-indicator";
import { PerformanceStats } from "@/components/ui/performance-stats";
import { ComboText, ScoreText } from "@/components/ui/text";
import { STAGE_SIZE } from "@/constants";
import { useAudioStore } from "@/stores/audio-store";
import { useEnemyStore } from "@/stores/enemy-store";
import { useExplosionStore } from "@/stores/explosion-store";
import { useGameStore } from "@/stores/game-store";
import { useInputStore } from "@/stores/input-store";
import { useMissileStore } from "@/stores/missile-store";
import { usePlayerStore } from "@/stores/player-store";
import { useScoreStore } from "@/stores/score-store";
import { GameEntity, Point } from "@/types";
import { useCollisionChecker } from "@/utils/collision-checker";
import { getSpriteRef, setAlive } from "@/utils/components";
import { createEntity } from "@/utils/entity-factory";

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
  const {
    playerMissiles,
    enemyMissiles,
    addPlayerMissile,
    addEnemyMissile,
    removePlayerMissile,
    removeEnemyMissile,
    resetMissiles,
  } = useMissileStore();
  const { enemies, removeEnemy, resetEnemies } = useEnemyStore();
  const { player, setPlayerVelocity, updatePlayer, resetPlayer } =
    usePlayerStore();

  const {
    checkMissileEnemyCollisions,
    checkMissilePlayerCollisions,
    checkEnemyPlayerCollisions,
    resetCollisionChecks,
  } = useCollisionChecker();

  const [renderTick, setRenderTick] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(false);
  const { isActionActive } = useInputStore();

  const { playSound, playMusic, stopMusic, muted } = useAudioStore();

  const updateRenderTick = useCallback(() => {
    setRenderTick((prev: number) => prev + 1);
  }, []);

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

  const handlePlayerMove = useCallback(
    (velocity: Point) => {
      setPlayerVelocity(velocity);
    },
    [setPlayerVelocity]
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
    endGame();

    if (!player) return;
    const sprite = getSpriteRef(player).current;
    if (sprite) {
      updatePlayer(setAlive(player, false));
      const explosion = createEntity("EXPLOSION", [sprite.x, sprite.y]);
      addExplosion(explosion);
      playSound("EXPLOSION_1");
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
    endGame,
    updateRenderTick,
    playSound,
  ]);

  const handleEnemyDeath = useCallback(
    (enemy: GameEntity) => {
      const sprite = getSpriteRef(enemy).current;
      if (sprite) {
        removeEnemy(enemy.id);
        const explosion = createEntity(
          "EXPLOSION",
          [sprite.x, sprite.y],
          "ENEMY"
        );
        addExplosion(explosion);
        playSound("EXPLOSION_2");
        addScore(100);
        updateRenderTick();
      }
    },
    [addExplosion, addScore, removeEnemy, updateRenderTick, playSound]
  );

  // Handle stats toggle
  useEffect(() => {
    const checkStatsToggle = () => {
      if (isActionActive("TOGGLE_STATS")) {
        setShowStats((prev) => !prev);
      }
    };

    const interval = setInterval(checkStatsToggle, 100);
    return () => clearInterval(interval);
  }, [isActionActive]);

  // Update game logic
  useTick(() => {
    if (!gameStarted) return;

    // Check for victory when all enemies are destroyed
    if (enemies.length === 0) {
      onVictory(score);
      return;
    }

    // Reset collision checks at the start of each tick
    resetCollisionChecks();

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
          position={[stageWidth / 2 - 20, -stageHeight / 2 + 45]}
          visible={muted}
        />
        <PerformanceStats
          renderTick={renderTick}
          position={[stageWidth / 2 - 20, -stageHeight / 2 + 15]}
          visible={showStats}
        />
        {player && (
          <Player
            entity={player}
            onMove={handlePlayerMove}
            onMissileSpawn={handlePlayerMissileSpawn}
            ref={getSpriteRef(player)}
          />
        )}
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
