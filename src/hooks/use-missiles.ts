import { useCallback } from "react";
import { useMissileStore } from "@/stores/missile-store";
import { Point } from "@/types";
import { createEntity } from "@/utils/entity-factory";

export function useMissiles() {
  const { addMissile, removeMissile } = useMissileStore();

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

  return {
    handlePlayerMissileSpawn,
    handleEnemyMissileSpawn,
    handleMissileDestroy,
  } as const;
}
