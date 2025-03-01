import { useEffect } from "react";
import { useEnemyStore } from "@/stores/enemy-store";
import { useExplosionStore } from "@/stores/explosion-store";
import { useGameStore } from "@/stores/game-store";
import { useMissileStore } from "@/stores/missile-store";
import { usePlayerStore } from "@/stores/player-store";
import { useScoreStore } from "@/stores/score-store";

export function useGameInit() {
  const { startGame } = useGameStore();
  const { resetScore } = useScoreStore();
  const { resetPlayer } = usePlayerStore();
  const { resetEnemies } = useEnemyStore();
  const { resetMissiles } = useMissileStore();
  const { resetExplosions } = useExplosionStore();

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
}
