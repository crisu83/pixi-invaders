import { Sprite, useTick } from "@pixi/react";
import { Texture, Rectangle } from "pixi.js";
import { useRef, useMemo, useState, useEffect } from "react";
import {
  Point,
  PlayerAnimationState,
  FRAMES,
  PLAYER_SIZE,
  PLAYER_SPEED,
  ANIMATION_SPEED,
} from "../constants";

export function Player({ onMove }: { onMove: (velocity: Point) => void }) {
  const [frame, setFrame] = useState(0);
  const [animationState, setAnimationState] =
    useState<PlayerAnimationState>("IDLE");
  const animationTime = useRef(0);

  const textures = useMemo(
    () => [
      // Idle frames
      new Texture(
        Texture.from("/sprites/ship_01.png").baseTexture,
        new Rectangle(0, 0, PLAYER_SIZE, PLAYER_SIZE)
      ),
      new Texture(
        Texture.from("/sprites/ship_01.png").baseTexture,
        new Rectangle(PLAYER_SIZE, 0, PLAYER_SIZE, PLAYER_SIZE)
      ),
      // Left tilt frames
      new Texture(
        Texture.from("/sprites/ship_01.png").baseTexture,
        new Rectangle(PLAYER_SIZE * 2, 0, PLAYER_SIZE, PLAYER_SIZE)
      ),
      new Texture(
        Texture.from("/sprites/ship_01.png").baseTexture,
        new Rectangle(PLAYER_SIZE * 3, 0, PLAYER_SIZE, PLAYER_SIZE)
      ),
      // Right tilt frames
      new Texture(
        Texture.from("/sprites/ship_01.png").baseTexture,
        new Rectangle(PLAYER_SIZE * 4, 0, PLAYER_SIZE, PLAYER_SIZE)
      ),
      new Texture(
        Texture.from("/sprites/ship_01.png").baseTexture,
        new Rectangle(PLAYER_SIZE * 5, 0, PLAYER_SIZE, PLAYER_SIZE)
      ),
    ],
    []
  );

  const [position, setPosition] = useState<Point>([0, 0]);
  const keysPressed = useRef<Set<string>>(new Set());
  const velocity = useRef<Point>([0, 0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
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
      const [firstFrame, lastFrame] = FRAMES[animationState];
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

  return <Sprite anchor={0.5} position={position} texture={textures[frame]} />;
}
