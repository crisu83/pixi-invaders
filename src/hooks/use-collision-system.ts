import { useGameStore } from "../stores/game-store";
import { createCollisionSystem } from "../systems/collision-system";
import { useMemo } from "react";

export function useCollisionSystem() {
  const gameState = useGameStore();
  return useMemo(() => createCollisionSystem(gameState), [gameState]);
}
