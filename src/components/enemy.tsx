import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import { ENEMY_SIZE, SPRITE_SCALE, ANIMATION_SPEED } from "../constants";
import { Point } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Enemy({
  position,
  alive,
}: {
  position: Point;
  alive: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: "/sprites/ship_02.png",
    frameCount: 2,
    size: ENEMY_SIZE,
  });

  useTick((delta) => {
    // Don't animate if not alive
    if (!alive) return;

    // Animation logic
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => (f + 1) % 2);
    }
  });

  return alive ? (
    <Sprite
      texture={textures[frame]}
      anchor={0.5}
      position={position}
      scale={SPRITE_SCALE}
    />
  ) : null;
}
