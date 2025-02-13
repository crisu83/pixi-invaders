import { Stage, Container } from "@pixi/react";
import { useRef, useCallback } from "react";
import { Point, STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { Background } from "./components/background";
import { Player } from "./components/player";

function Game() {
  const velocityRef = useRef<Point>([0, 0]);

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
  }, []);

  return (
    <Stage
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      options={{
        backgroundColor: 0x1a1a1a,
        antialias: true,
        eventMode: "static",
      }}
    >
      <Background velocityRef={velocityRef} />
      <Container position={[STAGE_WIDTH / 2, STAGE_HEIGHT / 2]}>
        <Player onMove={handlePlayerMove} />
      </Container>
    </Stage>
  );
}

export default Game;
