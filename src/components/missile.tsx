import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import {
  Point,
  MISSILE_SPEED,
  ANIMATION_SPEED,
  MISSILE_SIZE,
  STAGE_SIZE,
  SPRITE_SCALE,
} from "../constants";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Missile({
  initialPosition,
  onDestroy,
}: {
  initialPosition: Point;
  onDestroy: () => void;
}) {
  const [, stageHeight] = STAGE_SIZE;
  const [, missileHeight] = MISSILE_SIZE;

  const [frame, setFrame] = useState(0);
  const [position, setPosition] = useState<Point>(initialPosition);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: "/sprites/missile_01.png",
    frameCount: 2,
    size: MISSILE_SIZE,
  });

  useTick((delta) => {
    // Move missile upward
    const newY = position[1] - MISSILE_SPEED * delta;
    setPosition([position[0], newY]);

    // Animate missile
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => (f + 1) % 2);
    }

    // Destroy missile when it's completely off screen
    if (newY < -stageHeight / 2 - missileHeight) {
      onDestroy();
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
