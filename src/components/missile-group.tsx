import { useTick } from "@pixi/react";
import { GameEntity } from "../types";
import { Missile } from "./missile";
import { MISSILE_SPEED } from "../constants";
import { getSpriteRef } from "../utils/components";

export function MissileGroup({
  playerMissiles,
  enemyMissiles,
  onPlayerMissileDestroy,
  onEnemyMissileDestroy,
}: {
  playerMissiles: GameEntity[];
  enemyMissiles: GameEntity[];
  onPlayerMissileDestroy: (id: number) => void;
  onEnemyMissileDestroy: (id: number) => void;
}) {
  useTick((delta) => {
    // Move player missiles
    for (const missile of playerMissiles) {
      const sprite = getSpriteRef(missile).current;
      if (sprite) {
        sprite.y -= MISSILE_SPEED * delta;
      }
    }

    // Move enemy missiles
    for (const missile of enemyMissiles) {
      const sprite = getSpriteRef(missile).current;
      if (sprite) {
        sprite.y += MISSILE_SPEED * delta;
      }
    }
  });

  return (
    <>
      {playerMissiles.map((missile) => (
        <Missile
          key={missile.id}
          entity={missile}
          onDestroy={() => onPlayerMissileDestroy(missile.id)}
          ref={getSpriteRef(missile)}
        />
      ))}
      {enemyMissiles.map((missile) => (
        <Missile
          key={missile.id}
          entity={missile}
          onDestroy={() => onEnemyMissileDestroy(missile.id)}
          ref={getSpriteRef(missile)}
        />
      ))}
    </>
  );
}
