import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import { ANIMATION_SPEED, EXPLOSION_SIZE, SPRITE_SCALE } from "../constants";
import { Point } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Explosion({
  position,
  onFinish,
  texture = "explosion_02.png",
}: {
  position: Point;
  onFinish: () => void;
  size?: [number, number];
  texture?: string;
}) {
  const frameCount = 5;
  const [frame, setFrame] = useState(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: `/sprites/${texture}`,
    frameCount,
    size: EXPLOSION_SIZE,
  });

  useTick((delta) => {
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => {
        const next = f + 1;
        if (next >= frameCount) {
          onFinish();
          return 0;
        }
        return next;
      });
    }
  });

  return (
    <Sprite
      anchor={0.5}
      position={position}
      texture={textures[frame]}
      scale={SPRITE_SCALE}
    />
  );
}
