import { Container } from "@pixi/react";
import { useMemo } from "react";
import { Texture, Rectangle } from "pixi.js";
import { Point, SPRITE_SIZE } from "../constants";
import { StarLayer } from "./star-layer";

export function Background({
  velocityRef,
}: {
  velocityRef: React.RefObject<Point>;
}) {
  const textures = useMemo(
    () => ({
      stars1: new Texture(
        Texture.from("/sprites/stars_01.png").baseTexture,
        new Rectangle(0, 0, SPRITE_SIZE, SPRITE_SIZE)
      ),
      stars2: new Texture(
        Texture.from("/sprites/stars_02.png").baseTexture,
        new Rectangle(0, 0, SPRITE_SIZE, SPRITE_SIZE)
      ),
      stars3: new Texture(
        Texture.from("/sprites/stars_03.png").baseTexture,
        new Rectangle(0, 0, SPRITE_SIZE, SPRITE_SIZE)
      ),
    }),
    []
  );

  return (
    <Container>
      <StarLayer
        texture={textures.stars1}
        speed={0.3}
        velocityRef={velocityRef}
      />
      <StarLayer
        texture={textures.stars2}
        speed={0.5}
        velocityRef={velocityRef}
      />
      <StarLayer
        texture={textures.stars3}
        speed={0.7}
        velocityRef={velocityRef}
      />
    </Container>
  );
}
