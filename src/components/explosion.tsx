import { Sprite, useTick } from "@pixi/react";
import { forwardRef, useRef } from "react";
import { Sprite as PixiSprite } from "pixi.js";
import { ANIMATION_SPEED, EXPLOSION_SIZE, SPRITE_SCALE } from "../constants";
import { GameEntity } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";
import {
  getSpriteInitialPosition,
  getSpriteRef,
  getSpriteTexture,
} from "../utils/components";

export const Explosion = forwardRef<
  PixiSprite,
  {
    entity: GameEntity;
    onComplete: () => void;
  }
>(({ entity, onComplete }, ref) => {
  const frameCount = 5;

  const animationFrame = useRef(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: `/sprites/${getSpriteTexture(entity)}`,
    frameCount,
    size: EXPLOSION_SIZE,
  });

  useTick((delta) => {
    const sprite = getSpriteRef(entity).current;
    if (!sprite) return;

    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      animationFrame.current++;
      if (animationFrame.current >= frameCount) {
        onComplete();
      } else {
        sprite.texture = textures[animationFrame.current];
      }
    }
  });

  return animationFrame.current < frameCount ? (
    <Sprite
      anchor={0.5}
      texture={textures[0]}
      position={getSpriteInitialPosition(entity)}
      scale={SPRITE_SCALE}
      ref={ref}
    />
  ) : null;
});
