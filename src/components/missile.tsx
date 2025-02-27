import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef, useRef } from "react";
import {
  ANIMATION_SPEED,
  MISSILE_SIZE,
  MISSILE_SPEED,
  SPRITE_SCALE,
  STAGE_SIZE,
} from "../constants";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";
import { GameEntity } from "../types";
import {
  getSpriteInitialPosition,
  getSpriteRef,
  getSpriteTexture,
  setVelocity,
} from "../utils/components";

type MissileProps = {
  entity: GameEntity;
  onDestroy: () => void;
  direction: number;
};

export const Missile = forwardRef<PixiSprite, MissileProps>(
  ({ entity, onDestroy, direction }, ref) => {
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

      // Move based on direction
      const speed = direction * MISSILE_SPEED;
      setVelocity(entity, [0, speed * delta]);
      sprite.y += speed * delta;

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
  }
);
