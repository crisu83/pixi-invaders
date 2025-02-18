import { Container } from "@pixi/react";
import { Explosion } from "./explosion";
import { GameEntity } from "../types";
import { getExplosionTexture } from "../utils/entity";
import { Dispatch, SetStateAction } from "react";

export function ExplosionGroup({
  explosions,
  setExplosions,
}: {
  explosions: GameEntity[];
  setExplosions: Dispatch<SetStateAction<GameEntity[]>>;
}) {
  return (
    <Container>
      {explosions.map((explosion) => (
        <Explosion
          key={explosion.id}
          position={explosion.position}
          texture={getExplosionTexture(explosion)}
          onComplete={() =>
            setExplosions((prev) => prev.filter((e) => e.id !== explosion.id))
          }
        />
      ))}
    </Container>
  );
}
