import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef, useRef, useEffect } from "react";
import {
  MISSILE_SIZE,
  MISSILE_SPEED,
  SPRITE_SCALE,
  STAGE_SIZE,
} from "@/constants";
import { useSpriteAnimation } from "@/hooks/use-sprite-animation";
import { useSpriteSheet } from "@/hooks/use-sprite-sheet";
import { useAudioStore } from "@/stores/audio-store";
import { MissileEntity, Point } from "@/types";

type MissileProps = {
  entity: MissileEntity;
  onDestroy: () => void;
};

export const Missile = forwardRef<PixiSprite, MissileProps>(
  ({ entity, onDestroy }, ref) => {
    const [, stageHeight] = STAGE_SIZE;
    const [, missileHeight] = MISSILE_SIZE;

    const position = useRef<Point>(entity.position);

    const textures = useSpriteSheet({
      path: `/sprites/${entity.texture}`,
      frameCount: 2,
      size: MISSILE_SIZE,
    });
    const { texture, updateAnimation } = useSpriteAnimation({
      textures,
      frames: [0, 1],
    });
    const { playSound } = useAudioStore();

    // Play missile sound when component mounts
    useEffect(() => {
      playSound(entity.type === "PLAYER_MISSILE" ? "MISSILE_1" : "MISSILE_2");
    }, [playSound, entity.type]);

    useTick((delta) => {
      // Move based on missile type
      const direction = entity.type === "PLAYER_MISSILE" ? -1 : 1;
      const speed = direction * MISSILE_SPEED * delta;

      // Update position
      const nextY = position.current[1] + speed;
      position.current = [position.current[0], nextY];

      // Check if off screen and destroy
      if (
        nextY < -stageHeight / 2 - missileHeight ||
        nextY > stageHeight / 2 + missileHeight
      ) {
        onDestroy();
        return;
      }

      // Update animation
      updateAnimation(delta);
    });

    return (
      <Sprite
        anchor={0.5}
        texture={texture}
        position={[position.current[0], position.current[1]]}
        scale={SPRITE_SCALE}
        ref={ref}
      />
    );
  }
);
