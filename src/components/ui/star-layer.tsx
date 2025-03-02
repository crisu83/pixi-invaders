import { TilingSprite, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { useRef } from "react";
import { BACKGROUND_SCROLL_SPEED, SPRITE_SCALE, STAGE_SIZE } from "@/constants";
import { useGameStore } from "@/stores/game-store";
import { Point } from "@/types";

type StarLayerProps = {
  texture: Texture;
  speed: number;
};

export function StarLayer({ texture, speed = 1 }: StarLayerProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const player = useGameStore((state) => state.player);
  const position = useRef<Point>([0, 0]);

  useTick((delta) => {
    const playerVelocityX = player?.velocity[0] ?? 0;
    const newVelocity: Point = [
      -1 * playerVelocityX * speed * delta * 5,
      BACKGROUND_SCROLL_SPEED * speed * delta * 30,
    ];
    const newPosition: Point = [
      position.current[0] + newVelocity[0],
      position.current[1] + newVelocity[1],
    ];
    position.current = newPosition;
  });

  return (
    <TilingSprite
      texture={texture}
      width={stageWidth}
      height={stageHeight}
      scale={SPRITE_SCALE}
      tilePosition={[position.current[0], position.current[1]]}
    />
  );
}
