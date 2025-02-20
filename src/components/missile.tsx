import { Sprite, useTick } from "@pixi/react";
import { forwardRef, useRef } from "react";
import { Sprite as PixiSprite } from "pixi.js";
import {
  ANIMATION_SPEED,
  MISSILE_SIZE,
  SPRITE_SCALE,
  STAGE_SIZE,
} from "../constants";
import { GameEntity } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";
import {
  getSpriteInitialPosition,
  getSpriteRef,
  getSpriteTexture,
} from "../utils/components";

export const Missile = forwardRef<
  PixiSprite,
  {
    entity: GameEntity;
    onDestroy: () => void;
  }
>(({ entity, onDestroy }, ref) => {
  const [, stageHeight] = STAGE_SIZE;
  const [, missileHeight] = MISSILE_SIZE;

  const animationFrame = useRef(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: `/sprites/${getSpriteTexture(entity)}`,
    frameCount: 2,
    size: MISSILE_SIZE,
  });

  useTick((delta) => {
    const sprite = getSpriteRef(entity).current;
    if (!sprite) return;

    // Check if off screen and destroy
    if (
      sprite.y < -stageHeight / 2 - missileHeight ||
      sprite.y > stageHeight / 2 + missileHeight
    ) {
      onDestroy();
      return;
    }

    // Animate
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      animationFrame.current = (animationFrame.current + 1) % 2;
      sprite.texture = textures[animationFrame.current];
    }
  });

  return (
    <Sprite
      anchor={0.5}
      texture={textures[0]}
      position={getSpriteInitialPosition(entity)}
      scale={SPRITE_SCALE}
      ref={ref}
    />
  );
});
