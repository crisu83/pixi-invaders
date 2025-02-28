import { TilingSprite, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { useState } from "react";
import { BACKGROUND_SCROLL_SPEED, SPRITE_SCALE, STAGE_SIZE } from "@/constants";
import { usePlayerStore } from "@/stores/player-store";
import { Point } from "@/types";

type StarLayerProps = {
  texture: Texture;
  speed: number;
};

export function StarLayer({ texture, speed = 1 }: StarLayerProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const { playerVelocity } = usePlayerStore();
  const [position, setPosition] = useState<Point>([0, 0]);

  useTick((delta) => {
    setPosition([
      Math.round(position[0] - playerVelocity[0] * speed * delta * 5),
      Math.round(position[1] + BACKGROUND_SCROLL_SPEED * speed * delta * 30),
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
