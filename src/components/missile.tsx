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
  direction,
  texture,
  onMove = () => {},
}: {
  initialPosition: Point;
  onDestroy: () => void;
  direction: Point;
  texture: string;
  onMove?: (position: Point) => void;
}) {
  const [, stageHeight] = STAGE_SIZE;
  const [, missileHeight] = MISSILE_SIZE;

  const [position, setPosition] = useState<Point>(initialPosition);
  const [frame, setFrame] = useState(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: `/sprites/${texture}`,
    frameCount: 2,
    size: MISSILE_SIZE,
  });

  useTick((delta) => {
    // Move missile
    const newPosition: Point = [
      position[0] + MISSILE_SPEED * delta * direction[0],
      position[1] + MISSILE_SPEED * delta * direction[1],
    ];
    setPosition(newPosition);
    onMove(newPosition);

    // Check if off screen and destroy

    if (
      newPosition[1] < -stageHeight / 2 - missileHeight ||
      newPosition[1] > stageHeight / 2 + missileHeight
    ) {
      onDestroy();
    }

    // Animate
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      setFrame((f) => (f + 1) % 2);
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
