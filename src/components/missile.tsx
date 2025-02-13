import { Sprite, useTick } from "@pixi/react";
import { useRef, useState } from "react";
import {
  MISSILE_SPEED,
  ANIMATION_SPEED,
  MISSILE_SIZE,
  STAGE_SIZE,
  SPRITE_SCALE,
} from "../constants";
import { Point } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Missile({
  initialPosition,
  onDestroy,
  direction = [0, -1],
  texture = "missile_01.png",
}: {
  initialPosition: Point;
  onDestroy: () => void;
  direction?: Point;
  texture?: string;
}) {
  const [, stageHeight] = STAGE_SIZE;
  const [, missileHeight] = MISSILE_SIZE;

  const [frame, setFrame] = useState(0);
  const [position, setPosition] = useState<Point>(initialPosition);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: `/sprites/${texture}`,
    frameCount: 2,
    size: MISSILE_SIZE,
  });

  useTick((delta) => {
    // Move missile in specified direction
    const newPosition: Point = [
      position[0] + MISSILE_SPEED * delta * direction[0],
      position[1] + MISSILE_SPEED * delta * direction[1],
    ];
    setPosition(newPosition);

    // Animate missile
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => (f + 1) % 2);
    }

    // Destroy missile when it's completely off screen
    if (
      newPosition[1] < -stageHeight / 2 - missileHeight ||
      newPosition[1] > stageHeight / 2 + missileHeight
    ) {
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
