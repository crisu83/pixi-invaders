import { Sprite, useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import {
  PLAYER_FRAMES,
  PLAYER_SIZE,
  PLAYER_SPEED,
  ANIMATION_SPEED,
  SPRITE_SCALE,
  MISSILE_COOLDOWN,
  STAGE_SIZE,
  PLAYER_BOOST_MULTIPLIER,
  PLAYER_MARGIN,
} from "../constants";
import { Point, PlayerAnimationState } from "../types";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Player({
  initialPosition,
  onMove,
  onMissileSpawn,
  alive,
}: {
  initialPosition: Point;
  onMove: (velocity: Point) => void;
  onMissileSpawn: (position: Point) => void;
  alive: boolean;
}) {
  const [frame, setFrame] = useState(0);
  const [animationState, setAnimationState] =
    useState<PlayerAnimationState>("IDLE");
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: "/sprites/ship_01.png",
    frameCount: 6,
    size: PLAYER_SIZE,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const velocity = useRef<Point>([0, 0]);
  const lastShotTime = useRef(0);

  const [stageWidth] = STAGE_SIZE;

  // Calculate boundaries once
  const leftBound = -(stageWidth - PLAYER_MARGIN * 2) / 2;
  const rightBound = (stageWidth - PLAYER_MARGIN * 2) / 2;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!alive) return;
      keysPressed.current.add(e.key);
      if (e.code === "Space") {
        const now = Date.now();
        if (now - lastShotTime.current >= MISSILE_COOLDOWN) {
          onMissileSpawn(initialPosition);
          lastShotTime.current = now;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [initialPosition, onMissileSpawn, alive]);

  useTick((delta) => {
    // Don't update position or animate if not alive
    if (!alive) return;

    const isBoostPressed = keysPressed.current.has("Shift");
    const speed =
      PLAYER_SPEED * delta * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1);
    const newPos: Point = [...initialPosition];
    velocity.current = [0, 0];

    let newAnimationState: PlayerAnimationState = "IDLE";

    if (keysPressed.current.has("ArrowLeft")) {
      const nextX = Math.max(leftBound, newPos[0] - speed);
      newPos[0] = nextX;
      if (nextX > leftBound) {
        velocity.current[0] =
          -1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1);
      }
      newAnimationState = "TILT_LEFT";
    }
    if (keysPressed.current.has("ArrowRight")) {
      const nextX = Math.min(rightBound, newPos[0] + speed);
      newPos[0] = nextX;
      if (nextX < rightBound) {
        velocity.current[0] =
          1 * (isBoostPressed ? PLAYER_BOOST_MULTIPLIER : 1);
      }
      newAnimationState = "TILT_RIGHT";
    }

    onMove(velocity.current);
    setAnimationState(newAnimationState);

    // Update animation frame
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      const [firstFrame, lastFrame] = PLAYER_FRAMES[animationState];
      setFrame((f) => {
        if (f < firstFrame || f > lastFrame) {
          return firstFrame;
        }
        return f === firstFrame ? lastFrame : firstFrame;
      });
    }
  });

  return alive ? (
    <Sprite
      texture={textures[frame]}
      anchor={0.5}
      position={initialPosition}
      scale={SPRITE_SCALE}
    />
  ) : null;
}
