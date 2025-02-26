import { GameEntity } from "../types";
import { Explosion } from "./explosion";
import { getSpriteRef } from "../utils/components";

type ExplosionGroupProps = {
  explosions: GameEntity[];
  onExplosionComplete: (id: number) => void;
};

export function ExplosionGroup({
  explosions,
  onExplosionComplete,
}: ExplosionGroupProps) {
  return (
    <>
      {explosions.map((explosion) => (
        <Explosion
          key={explosion.id}
          entity={explosion}
          onComplete={() => onExplosionComplete(explosion.id)}
          ref={getSpriteRef(explosion)}
        />
      ))}
    </>
  );
}
