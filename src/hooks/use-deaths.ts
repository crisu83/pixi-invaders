import { useCallback } from "react";
import { useEnemyStore } from "@/stores/enemy-store";
import { useExplosionStore } from "@/stores/explosion-store";
import { useGameStore } from "@/stores/game-store";
import { usePlayerStore } from "@/stores/player-store";
import { useScoreStore } from "@/stores/score-store";
import { EnemyEntity } from "@/types";
import { createEntity } from "@/utils/entity-factory";

type UseDeathsProps = {
  onGameOver: (score: number) => void;
};

export function useDeaths({ onGameOver }: UseDeathsProps) {
  const { endGame } = useGameStore();
  const { player, removePlayer } = usePlayerStore();
  const { removeEnemy } = useEnemyStore();
  const { score, addScore } = useScoreStore();
  const { addExplosion } = useExplosionStore();

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

  return {
    handlePlayerDeath,
    handleEnemyDeath,
  } as const;
}
