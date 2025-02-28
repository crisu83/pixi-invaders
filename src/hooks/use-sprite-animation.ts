import { Texture } from "pixi.js";
import { useRef } from "react";
import { ANIMATION_SPEED } from "@/constants";

type AnimationConfig = Readonly<{
  textures: readonly Texture[];
  frames: readonly [number, number];
  speed?: number;
}>;

export function useSpriteAnimation({
  textures,
  frames,
  speed = ANIMATION_SPEED,
}: AnimationConfig) {
  const animationFrame = useRef(frames[0]);
  const animationTime = useRef(0);

  const updateAnimation = (delta: number) => {
    animationTime.current += delta * speed;

    if (animationTime.current >= 1) {
      animationTime.current = 0;
      const [firstFrame, lastFrame] = frames;

      // Reset to first frame if outside range
      if (
        animationFrame.current < firstFrame ||
        animationFrame.current > lastFrame
      ) {
        animationFrame.current = firstFrame;
      } else {
        // Toggle between first and last frame
        animationFrame.current =
          animationFrame.current === firstFrame ? lastFrame : firstFrame;
      }
    }
  };

  return {
    texture: textures[animationFrame.current],
    updateAnimation,
  } as const;
}
