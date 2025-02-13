import { useMemo } from "react";
import { Texture, Rectangle, SCALE_MODES } from "pixi.js";
import { Size } from "../constants";

type TextureConfig = {
  path: string;
  size: Size;
};

export function useTexture({ path, size }: TextureConfig): Texture {
  return useMemo(
    () =>
      new Texture(
        Texture.from(path, {
          scaleMode: SCALE_MODES.NEAREST,
        }).baseTexture,
        new Rectangle(0, 0, size[0], size[1])
      ),
    [path, size]
  );
}
