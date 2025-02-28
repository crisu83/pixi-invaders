import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef } from "react";
import { ENEMY_SIZE, SPRITE_SCALE } from "@/constants";
import { useSpriteAnimation } from "@/hooks/use-sprite-animation";
import { useSpriteSheet } from "@/hooks/use-sprite-sheet";
import { EnemyEntity } from "@/types";

type EnemyProps = {
  entity: EnemyEntity;
};

export const Enemy = forwardRef<PixiSprite, EnemyProps>(({ entity }, ref) => {
  const textures = useSpriteSheet({
    path: "/sprites/ship_02.png",
    frameCount: 2,
    size: ENEMY_SIZE,
  });
  const { texture, updateAnimation } = useSpriteAnimation({
    textures,
    frames: [0, 1],
  });

  useTick((delta) => {
    if (!entity.alive) return;

    updateAnimation(delta);
  });

  return (
    entity.alive && (
      <Sprite
        anchor={0.5}
        texture={texture}
        position={[entity.position[0], entity.position[1]]}
        scale={SPRITE_SCALE}
        ref={ref}
      />
    )
  );
});
