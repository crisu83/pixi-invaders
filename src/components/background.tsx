import { Container } from "@pixi/react";
import { Point } from "../types";
import { STARS_SIZE } from "../constants";
import { StarLayer } from "./star-layer";
import { useTexture } from "../hooks/use-texture";

export function Background({
  velocityRef,
}: {
  velocityRef: React.RefObject<Point>;
}) {
  const stars1 = useTexture({
    path: "/sprites/stars_01.png",
    size: STARS_SIZE,
  });

  const stars2 = useTexture({
    path: "/sprites/stars_02.png",
    size: STARS_SIZE,
  });

  const stars3 = useTexture({
    path: "/sprites/stars_03.png",
    size: STARS_SIZE,
  });

  return (
    <Container>
      <StarLayer texture={stars1} speed={0.2} velocityRef={velocityRef} />
      <StarLayer texture={stars2} speed={0.4} velocityRef={velocityRef} />
      <StarLayer texture={stars3} speed={0.6} velocityRef={velocityRef} />
    </Container>
  );
}
