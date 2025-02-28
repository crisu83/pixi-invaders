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
import { useInputStore } from "@/stores/input-store";
import { usePlayerStore } from "@/stores/player-store";
import { PlayerEntity, PlayerAnimationState, Point } from "@/types";

type PlayerProps = {
  entity: PlayerEntity;
  onMissileSpawn: (position: Point) => void;
};

export const Player = forwardRef<PixiSprite, PlayerProps>(
  ({ entity, onMissileSpawn }, ref) => {
    const position = useRef<Point>(entity.position);
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
    const updatePlayer = usePlayerStore((state) => state.updatePlayer);

    const [stageWidth] = STAGE_SIZE;
    const leftBound = -(stageWidth - STAGE_MARGIN * 2) / 2;
    const rightBound = (stageWidth - STAGE_MARGIN * 2) / 2;

    useTick((delta) => {
      if (!entity.alive) return;

      const isBoostPressed = isActionActive("BOOST");
      const moveLeft = isActionActive("MOVE_LEFT");
      const moveRight = isActionActive("MOVE_RIGHT");

      const speed =
        PLAYER_SPEED * delta * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1);
      let newVelocity: Point = [0, 0];
      let newPosition = position.current;

      // Handle shooting
      if (isActionActive("SHOOT")) {
        onMissileSpawn(position.current);
      }

      // Handle movement and animation state
      if (moveLeft) {
        const nextX = Math.max(leftBound, position.current[0] - speed);
        newPosition = [nextX, position.current[1]] as const;
        newVelocity = [
          -1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1),
          0,
        ] as const;
        animationState.current = "LEFT";
      } else if (moveRight) {
        const nextX = Math.min(rightBound, position.current[0] + speed);
        newPosition = [nextX, position.current[1]] as const;
        newVelocity = [
          1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1),
          0,
        ] as const;
        animationState.current = "RIGHT";
      } else {
        animationState.current = "IDLE";
      }

      // Update position ref for next frame
      position.current = newPosition;

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
      entity.alive && (
        <Sprite
          anchor={0.5}
          texture={texture}
          position={[position.current[0], position.current[1]]}
          scale={SPRITE_SCALE}
          ref={ref}
        />
      )
    );
  }
);
