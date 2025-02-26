import { Sprite, useTick } from "@pixi/react";
import { forwardRef, useRef } from "react";
import { Sprite as PixiSprite } from "pixi.js";
import {
  PLAYER_FRAMES,
  PLAYER_SIZE,
  PLAYER_SPEED,
  ANIMATION_SPEED,
  SPRITE_SCALE,
  STAGE_SIZE,
  PLAYER_BOOST_MULTIPLIER,
  STAGE_MARGIN,
} from "../constants";
import { GameEntity, Point, PlayerAnimationState } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";
import {
  getSpriteInitialPosition,
  getSpriteRef,
  isAlive,
  setVelocity,
} from "../utils/components";
import { useInputStore } from "../stores/input-store";
import { useAudioStore } from "../stores/audio-store";

type PlayerProps = {
  entity: GameEntity;
  onMove: (velocity: Point) => void;
  onMissileSpawn: (position: Point) => void;
};

export const Player = forwardRef<PixiSprite, PlayerProps>(
  ({ entity, onMove, onMissileSpawn }, ref) => {
    const animationFrame = useRef(0);
    const animationState = useRef<PlayerAnimationState>("IDLE");
    const animationTime = useRef(0);

    const textures = useSpriteSheet({
      path: "/sprites/ship_01.png",
      frameCount: 6,
      size: PLAYER_SIZE,
    });

    // Get store functions
    const isActionActive = useInputStore((state) => state.isActionActive);
    const playSound = useAudioStore((state) => state.playSound);

    const [stageWidth] = STAGE_SIZE;

    // Calculate boundaries once
    const leftBound = -(stageWidth - STAGE_MARGIN * 2) / 2;
    const rightBound = (stageWidth - STAGE_MARGIN * 2) / 2;

    useTick((delta) => {
      // Don't update position or animate if not alive
      if (!isAlive(entity)) return;

      const sprite = getSpriteRef(entity).current;
      if (!sprite) return;

      const isBoostPressed = isActionActive("BOOST");
      const speed =
        PLAYER_SPEED * delta * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1);

      let newAnimationState: PlayerAnimationState = "IDLE";
      let newVelocity: Point = [0, 0];

      // Handle shooting
      if (isActionActive("SHOOT")) {
        onMissileSpawn([sprite.x, sprite.y]);
        playSound("MISSILE_1");
      }

      // Handle movement
      if (isActionActive("MOVE_LEFT")) {
        const nextX = Math.max(leftBound, sprite.x - speed);
        sprite.x = nextX;
        if (nextX > leftBound) {
          newVelocity = [
            -1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1),
            0,
          ];
        }
        newAnimationState = "TILT_LEFT";
      } else if (isActionActive("MOVE_RIGHT")) {
        const nextX = Math.min(rightBound, sprite.x + speed);
        sprite.x = nextX;
        if (nextX < rightBound) {
          newVelocity = [1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1), 0];
        }
        newAnimationState = "TILT_RIGHT";
      }

      setVelocity(entity, newVelocity);
      onMove(newVelocity);
      animationState.current = newAnimationState;

      // Update animation frame
      animationTime.current += delta * ANIMATION_SPEED;
      if (animationTime.current >= 1) {
        animationTime.current = 0;
        const [firstFrame, lastFrame] = PLAYER_FRAMES[animationState.current];
        if (
          animationFrame.current < firstFrame ||
          animationFrame.current > lastFrame
        ) {
          animationFrame.current = firstFrame;
        } else {
          animationFrame.current =
            animationFrame.current === firstFrame ? lastFrame : firstFrame;
        }
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
  }
);
