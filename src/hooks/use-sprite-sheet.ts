import { Rectangle, Texture } from "pixi.js";
import { useMemo } from "react";
import { Size } from "@/types";
import { useTexture } from "./use-texture";

type SpriteConfig = {
  path: string;
  frameCount: number;
  size: Size;
};

export function useSpriteSheet({
  path,
  frameCount = 1,
  size,
}: SpriteConfig): Texture[] {
  const baseTexture = useTexture({ path, size });

  return useMemo(
    () =>
      Array.from(
        { length: frameCount },
        (_, i) =>
          new Texture(
            baseTexture.baseTexture,
            new Rectangle(i * size[0], 0, size[0], size[1])
          )
      ),
    [baseTexture, frameCount, size]
  );
}
