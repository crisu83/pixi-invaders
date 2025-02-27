import { GameEntity } from "../../types";
import { getSpriteRef } from "../../utils/components";
import { Missile } from "./missile";

type MissileGroupProps = {
  playerMissiles: GameEntity[];
  enemyMissiles: GameEntity[];
  onPlayerMissileDestroy: (id: number) => void;
  onEnemyMissileDestroy: (id: number) => void;
};

export function MissileGroup({
  playerMissiles,
  enemyMissiles,
  onPlayerMissileDestroy,
  onEnemyMissileDestroy,
}: MissileGroupProps) {
  return (
    <>
      {playerMissiles.map((missile) => (
        <Missile
          key={missile.id}
          entity={missile}
          onDestroy={() => onPlayerMissileDestroy(missile.id)}
          ref={getSpriteRef(missile)}
          direction={-1}
        />
      ))}
      {enemyMissiles.map((missile) => (
        <Missile
          key={missile.id}
          entity={missile}
          onDestroy={() => onEnemyMissileDestroy(missile.id)}
          ref={getSpriteRef(missile)}
          direction={1}
        />
      ))}
    </>
  );
}
