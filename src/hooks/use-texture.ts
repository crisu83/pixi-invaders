import { Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { useMemo } from "react";
import { Size } from "../types";

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
