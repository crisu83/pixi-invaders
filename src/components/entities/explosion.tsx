import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef, useRef, useEffect } from "react";
import { ParticleExplosion } from "@/components/effects/particle-explosion";
import { ANIMATION_SPEED, EXPLOSION_SIZE, SPRITE_SCALE } from "@/constants";
import { useSpriteSheet } from "@/hooks/use-sprite-sheet";
import { useAudioStore } from "@/stores/audio-store";
import { PlayerExplosionEntity, EnemyExplosionEntity } from "@/types";
import { getSpriteRef } from "@/utils/entity-helpers";

type ExplosionProps = {
  entity: PlayerExplosionEntity | EnemyExplosionEntity;
  onComplete: () => void;
};

export const Explosion = forwardRef<PixiSprite, ExplosionProps>(
  ({ entity, onComplete }, ref) => {
    const frameCount = 5;
    const { playSound } = useAudioStore();

    const animationFrame = useRef(0);
    const animationTime = useRef(0);

    const textures = useSpriteSheet({
      path: `/sprites/${entity.texture}`,
      frameCount,
      size: EXPLOSION_SIZE,
    });

    // Play explosion sound when component mounts
    useEffect(() => {
      playSound(
        entity.type === "PLAYER_EXPLOSION" ? "EXPLOSION_1" : "EXPLOSION_2"
      );
    }, [playSound, entity.type]);

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

    return (
      <>
        {animationFrame.current < frameCount && (
          <Sprite
            anchor={0.5}
            texture={textures[0]}
            position={[entity.position[0], entity.position[1]]}
            scale={SPRITE_SCALE}
            ref={ref}
          />
        )}
        <ParticleExplosion
          initialPosition={[entity.position[0], entity.position[1]]}
          color={entity.type === "PLAYER_EXPLOSION" ? 0xff8000 : 0x00ff00}
        />
      </>
    );
  }
);
