import { GameEntity } from "../types";
import { Missile } from "./missile";
import { getSpriteRef } from "../utils/components";

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
