import { GameEntity, Point } from "../types";
import { Missile } from "./missile";
import { Container } from "@pixi/react";

export function MissileGroup({
  missiles,
  setMissiles,
  direction,
  texture,
}: {
  missiles: GameEntity[];
  setMissiles: React.Dispatch<React.SetStateAction<GameEntity[]>>;
  direction: Point;
  texture: string;
}) {
  return (
    <Container>
      {missiles.map((missile) => (
        <Missile
          key={missile.id}
          initialPosition={missile.position}
          direction={direction}
          texture={texture}
          onMove={(newPosition) => {
            setMissiles((prev) =>
              prev.map((m) =>
                m.id === missile.id ? { ...m, position: newPosition } : m
              )
            );
          }}
          onDestroy={() => {
            setMissiles((prev) => prev.filter((m) => m.id !== missile.id));
          }}
        />
      ))}
    </Container>
  );
}
