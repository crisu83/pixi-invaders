import { Sprite, useTick } from "@pixi/react";
import { useRef, useState, useEffect } from "react";
import {
  Point,
  PlayerAnimationState,
  PLAYER_FRAMES,
  PLAYER_SIZE,
  PLAYER_SPEED,
  ANIMATION_SPEED,
  SPRITE_SCALE,
  MISSLE_COOLDOWN,
} from "../constants";
import { Missile } from "./missile";
import { useSpriteSheet } from "../hooks/use-sprite-sheet";

export function Player({ onMove }: { onMove: (velocity: Point) => void }) {
  const [frame, setFrame] = useState(0);
  const [animationState, setAnimationState] =
    useState<PlayerAnimationState>("IDLE");
  const animationTime = useRef(0);

  const textures = useSpriteSheet({
    path: "/sprites/ship_01.png",
    frameCount: 6,
    size: PLAYER_SIZE,
  });

  const [position, setPosition] = useState<Point>([0, 0]);
  const keysPressed = useRef<Set<string>>(new Set());
  const velocity = useRef<Point>([0, 0]);
  const [missiles, setMissiles] = useState<number[]>([]);
  const nextMissileId = useRef(0);
  const lastShotTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      // Fire missile on space with cooldown
      if (e.code === "Space") {
        const now = Date.now();
        if (now - lastShotTime.current >= MISSLE_COOLDOWN) {
          setMissiles((prev) => [...prev, nextMissileId.current++]);
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
  }, []);

  useTick((delta) => {
    const speed = PLAYER_SPEED * delta;
    const newPos: Point = [...position];
    velocity.current = [0, 0];

    // Update movement and animation state
    let newAnimationState: PlayerAnimationState = "IDLE";

    if (keysPressed.current.has("ArrowLeft")) {
      newPos[0] -= speed;
      velocity.current[0] = -1;
      newAnimationState = "TILT_LEFT";
    }
    if (keysPressed.current.has("ArrowRight")) {
      newPos[0] += speed;
      velocity.current[0] = 1;
      newAnimationState = "TILT_RIGHT";
    }
    if (keysPressed.current.has("ArrowUp")) {
      newPos[1] -= speed;
      velocity.current[1] = -1;
    }
    if (keysPressed.current.has("ArrowDown")) {
      newPos[1] += speed;
      velocity.current[1] = 1;
    }

    setPosition(newPos);
    onMove(velocity.current);
    setAnimationState(newAnimationState);

    // Update animation frame
    animationTime.current += delta * ANIMATION_SPEED;
    if (animationTime.current >= 1) {
      animationTime.current = 0;
      const [firstFrame, lastFrame] = PLAYER_FRAMES[animationState];
      setFrame((f) => {
        // If current frame isn't in the current animation range, start from first frame
        if (f < firstFrame || f > lastFrame) {
          return firstFrame;
        }
        // Otherwise alternate between first and last frame
        return f === firstFrame ? lastFrame : firstFrame;
      });
    }
  });

  return (
    <>
      <Sprite
        anchor={0.5}
        position={position}
        texture={textures[frame]}
        scale={SPRITE_SCALE}
      />
      {missiles.map((id) => (
        <Missile
          key={id}
          initialPosition={position}
          onDestroy={() => {
            setMissiles((prev) => prev.filter((m) => m !== id));
          }}
        />
      ))}
    </>
  );
}
