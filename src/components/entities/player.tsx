import { Sprite, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { forwardRef, useRef } from "react";
import {
  PLAYER_BOOST_MULTIPLIER,
  PLAYER_FRAMES,
  PLAYER_SIZE,
  PLAYER_SPEED,
  SPRITE_SCALE,
  STAGE_MARGIN,
  STAGE_SIZE,
} from "@/constants";
import { useSpriteAnimation } from "@/hooks/use-sprite-animation";
import { useSpriteSheet } from "@/hooks/use-sprite-sheet";
import { useGameStore } from "@/stores/game-store";
import { useInputStore } from "@/stores/input-store";
import { PlayerEntity, PlayerAnimationState, Point } from "@/types";

type PlayerProps = {
  entity: PlayerEntity;
  onMissileSpawn: (position: Point) => void;
};

export const Player = forwardRef<PixiSprite, PlayerProps>(
  ({ entity, onMissileSpawn }, ref) => {
    const animationState = useRef<PlayerAnimationState>("IDLE");

    const textures = useSpriteSheet({
      path: "/sprites/ship_01.png",
      frameCount: 6,
      size: PLAYER_SIZE,
    });
    const { texture, updateAnimation } = useSpriteAnimation({
      textures,
      frames: PLAYER_FRAMES[animationState.current],
    });
    const isActionActive = useInputStore((state) => state.isActionActive);
    const updatePlayer = useGameStore((state) => state.updatePlayer);

    const [stageWidth] = STAGE_SIZE;
    const leftBound = -(stageWidth - STAGE_MARGIN * 2) / 2;
    const rightBound = (stageWidth - STAGE_MARGIN * 2) / 2;

    useTick((delta) => {
      const isBoostPressed = isActionActive("BOOST");
      const moveLeft = isActionActive("MOVE_LEFT");
      const moveRight = isActionActive("MOVE_RIGHT");

      const speed =
        PLAYER_SPEED * delta * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1);
      let newVelocity: Point = [0, 0];
      let newPosition = entity.position;

      // Handle shooting
      if (isActionActive("SHOOT")) {
        onMissileSpawn(entity.position);
      }

      // Handle movement and animation state
      if (moveLeft) {
        const nextX = Math.max(leftBound, entity.position[0] - speed);
        newPosition = [nextX, entity.position[1]] as const;
        newVelocity = [
          -1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1),
          0,
        ] as const;
        animationState.current = "LEFT";
      } else if (moveRight) {
        const nextX = Math.min(rightBound, entity.position[0] + speed);
        newPosition = [nextX, entity.position[1]] as const;
        newVelocity = [
          1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1),
          0,
        ] as const;
        animationState.current = "RIGHT";
      } else {
        animationState.current = "IDLE";
      }

      // Create new player entity with updated properties
      const updatedPlayer: PlayerEntity = {
        ...entity,
        position: newPosition,
        velocity: newVelocity,
      };
      updatePlayer(updatedPlayer);

      // Update animation
      updateAnimation(delta);
    });

    return (
      <Sprite
        anchor={0.5}
        texture={texture}
        position={[entity.position[0], entity.position[1]]}
        scale={SPRITE_SCALE}
        ref={ref}
      />
    );
  }
);
