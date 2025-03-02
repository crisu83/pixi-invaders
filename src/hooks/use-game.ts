import { useCallback, useEffect } from "react";
import { useGameStore } from "@/stores/game-store";
import { useScoreStore } from "@/stores/score-store";
import { EnemyEntity, Point } from "@/types";
import { createEntity } from "@/utils/entity-factory";

type UseGameProps = {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
};

export function useGame({ onGameOver, onVictory }: UseGameProps) {
  const {
    // Game state
    gameStarted,
    gameOver,

    // Entities
    player,
    enemies,
    missiles,
    explosions,

    // Game actions
    resetGame,
    endGame,

    // Entity actions
    updatePlayer,
    removePlayer,
    removeEnemy,
    addMissile,
    removeMissile,
    addExplosion,
    removeExplosion,
  } = useGameStore();

  const { score, addScore, resetScore } = useScoreStore();

  // Initialize game on mount
  useEffect(() => {
    resetGame();
    resetScore();
  }, [resetGame, resetScore]);

  // Missile handlers
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

  // Death handlers
  const handlePlayerDeath = useCallback(() => {
    if (!player) return;
    endGame();
    const explosion = createEntity("PLAYER_EXPLOSION", player.position);
    removePlayer();
    addExplosion(explosion);
    setTimeout(() => onGameOver(score), 1000);
  }, [player, endGame, removePlayer, addExplosion, score, onGameOver]);

  const handleEnemyDeath = useCallback(
    (enemy: EnemyEntity) => {
      removeEnemy(enemy.id);
      const explosion = createEntity("ENEMY_EXPLOSION", enemy.position);
      addExplosion(explosion);
      addScore(100);

      // Check for victory when all enemies are destroyed
      if (enemies.length <= 1) {
        // Using 1 since this enemy hasn't been removed yet
        setTimeout(() => onVictory(score), 1000);
      }
    },
    [enemies.length, removeEnemy, addExplosion, addScore, score, onVictory]
  );

  return {
    // Game state
    gameStarted,
    gameOver,
    score,

    // Entities
    player,
    enemies,
    missiles,
    explosions,

    // Entity handlers
    handlePlayerMissileSpawn,
    handleEnemyMissileSpawn,
    removeMissile,
    removeExplosion,
    handlePlayerDeath,
    handleEnemyDeath,
    updatePlayer,
  } as const;
}
