import { useCallback } from "react";
import { useExplosionStore } from "@/stores/explosion-store";

export function useExplosions() {
  const { removeExplosion } = useExplosionStore();

  const handleExplosionComplete = useCallback(
    (explosionId: number) => {
      removeExplosion(explosionId);
    },
    [removeExplosion]
  );

  return {
    handleExplosionComplete,
  } as const;
}
