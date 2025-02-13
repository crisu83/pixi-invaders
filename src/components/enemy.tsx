import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import { ENEMY_SIZE, SPRITE_SCALE, ANIMATION_SPEED } from "../constants";
import { Point } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Enemy({ initialPosition }: { initialPosition: Point }) {
  const [frame, setFrame] = useState(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: "/sprites/ship_02.png",
    frameCount: 2,
    size: ENEMY_SIZE,
  });

  useTick((delta) => {
    // Just handle animation
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => (f + 1) % 2);
    }
  });

  return (
    <Sprite
      anchor={0.5}
      position={initialPosition}
      texture={textures[frame]}
      scale={SPRITE_SCALE}
    />
  );
}
