import { useCallback } from "react";
import { GameEntity, Size } from "../types";

function checkCollision(
  a: GameEntity,
  b: GameEntity,
  sizeA: Size,
  sizeB: Size
): boolean {
  const dx = Math.abs(a.position[0] - b.position[0]);
  const dy = Math.abs(a.position[1] - b.position[1]);
  return dx < (sizeA[0] + sizeB[0]) / 2 && dy < (sizeA[1] + sizeB[1]) / 2;
}

export function useCollisionDetection() {
  return useCallback(checkCollision, []);
}
