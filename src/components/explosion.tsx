import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import { ANIMATION_SPEED, EXPLOSION_SIZE, SPRITE_SCALE } from "../constants";
import { Point } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Explosion({
  position,
  texture,
  onFinish,
}: {
  position: Point;
  texture: string;
  onFinish: () => void;
}) {
  const frameCount = 5;
  const [frame, setFrame] = useState(0);
  const animationTime = useRef(0);
  const [done, setDone] = useState(false);

  const textures = useSpriteSheet({
    path: `/sprites/${texture}`,
    frameCount,
    size: EXPLOSION_SIZE,
  });

  useTick((delta) => {
    if (done) return;

    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => {
        const next = f + 1;
        if (next >= frameCount) {
          setDone(true);
          onFinish();
          return f;
        }
        return next;
      });
    }
  });

  return !done ? (
    <Sprite
      anchor={0.5}
      position={position}
      texture={textures[frame]}
      scale={SPRITE_SCALE}
    />
  ) : null;
}
