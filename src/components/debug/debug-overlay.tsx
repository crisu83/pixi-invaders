import { useDebugStore } from "@/stores/debug-store";
import {
  EnemyEntity,
  ExplosionEntity,
  MissileEntity,
  PlayerEntity,
} from "@/types";
import { HitBoxOverlay } from "./hit-box-overlay";

type DebugOverlayProps = {
  player: PlayerEntity | null;
  enemies: EnemyEntity[];
  missiles: MissileEntity[];
  explosions: ExplosionEntity[];
};

export function DebugOverlay({
  player,
  enemies,
  missiles,
  explosions,
}: DebugOverlayProps) {
  const showHitBoxes = useDebugStore((state) => state.showStats);

  if (!showHitBoxes) return null;

  return (
    <>
      {/* Player hit box in red */}
      {player && <HitBoxOverlay entity={player} color={0xff0000} />}

      {/* Enemy hit boxes in green */}
      {enemies.map((enemy) => (
        <HitBoxOverlay key={enemy.id} entity={enemy} color={0x00ff00} />
      ))}

      {/* Missile hit boxes in yellow */}
      {missiles.map((missile) => (
        <HitBoxOverlay key={missile.id} entity={missile} color={0xffff00} />
      ))}

      {/* Explosion hit boxes in blue */}
      {explosions.map((explosion) => (
        <HitBoxOverlay key={explosion.id} entity={explosion} color={0x0000ff} />
      ))}
    </>
  );
}
