import { ExplosionEntity } from "@/types";
import { getSpriteRef } from "@/utils/entity-helpers";
import { Explosion } from "./explosion";

type ExplosionGroupProps = {
  explosions: ExplosionEntity[];
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
