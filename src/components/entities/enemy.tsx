import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef, useRef } from "react";
import { ANIMATION_SPEED, ENEMY_SIZE, SPRITE_SCALE } from "@/constants";
import { useSpriteSheet } from "@/hooks/use-sprite-sheet";
import { EnemyEntity } from "@/types";

type EnemyProps = {
  entity: EnemyEntity;
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
    if (!entity.alive) return;

    // Animation logic
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      animationFrame.current = (animationFrame.current + 1) % 2;
    }
  });

  return (
    entity.alive && (
      <Sprite
        anchor={0.5}
        texture={textures[animationFrame.current]}
        position={[entity.position[0], entity.position[1]]}
        scale={SPRITE_SCALE}
        ref={ref}
      />
    )
  );
});
