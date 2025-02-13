import { Stage, Container } from "@pixi/react";
import { useRef, useCallback } from "react";
import { Point, STAGE_SIZE } from "./constants";
import { Background } from "./components/background";
import { Player } from "./components/player";

export function Game() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const velocityRef = useRef<Point>([0, 0]);

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
  }, []);

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      options={{
        backgroundColor: 0x1a1a1a,
        antialias: true,
        eventMode: "static",
      }}
    >
      <Background velocityRef={velocityRef} />
      <Container position={[stageWidth / 2, stageHeight / 2]}>
        <Player onMove={handlePlayerMove} />
      </Container>
    </Stage>
  );
}
