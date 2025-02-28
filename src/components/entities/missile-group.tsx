import { MissileEntity } from "@/types";
import { getSpriteRef } from "@/utils/entity-helpers";
import { Missile } from "./missile";

type MissileGroupProps = {
  missiles: MissileEntity[];
  onMissileDestroy: (id: number) => void;
};

export function MissileGroup({
  missiles,
  onMissileDestroy,
}: MissileGroupProps) {
  return (
    <>
      {missiles.map((missile) => (
        <Missile
          key={missile.id}
          entity={missile}
          onDestroy={() => onMissileDestroy(missile.id)}
          ref={getSpriteRef(missile)}
        />
      ))}
    </>
  );
}
