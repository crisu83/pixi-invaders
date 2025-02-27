import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef, useRef } from "react";
import { ANIMATION_SPEED, ENEMY_SIZE, SPRITE_SCALE } from "../constants";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";
import { GameEntity } from "../types";
import {
  getSpriteInitialPosition,
  getSpriteRef,
  isAlive,
} from "../utils/components";

type EnemyProps = {
  entity: GameEntity;
};

export const Enemy = forwardRef<PixiSprite, EnemyProps>(({ entity }, ref) => {
  const animationFrame = useRef(0);
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: "/sprites/ship_02.png",
    frameCount: 2,
    size: ENEMY_SIZE,
  });

  useTick((delta) => {
    // Don't animate or move if not alive
    if (!isAlive(entity)) return;

    const sprite = getSpriteRef(entity).current;
    if (!sprite) return;

    // Animation logic
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      animationFrame.current = (animationFrame.current + 1) % 2;
      sprite.texture = textures[animationFrame.current];
    }
  });

  return isAlive(entity) ? (
    <Sprite
      anchor={0.5}
      texture={textures[0]}
      position={getSpriteInitialPosition(entity)}
      scale={SPRITE_SCALE}
      ref={ref}
    />
  ) : null;
});
