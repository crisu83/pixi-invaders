import { TilingSprite, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { useState } from "react";
import { Point, STAGE_SIZE, SPRITE_SCALE } from "../constants";

export function StarLayer({
  texture,
  speed = 1,
  velocityRef,
}: {
  texture: Texture;
  speed: number;
  velocityRef: React.RefObject<Point>;
}) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const [position, setPosition] = useState<Point>([0, 0]);

  useTick((delta) => {
    setPosition([
      Math.round(position[0] - velocityRef.current![0] * speed * delta * 5),
      Math.round(position[1] - velocityRef.current![1] * speed * delta * 5),
    ]);
  });

  return (
    <TilingSprite
      texture={texture}
      width={stageWidth}
      height={stageHeight}
      scale={SPRITE_SCALE}
      tilePosition={[position[0], position[1]]}
    />
  );
}
