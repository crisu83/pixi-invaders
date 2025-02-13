import { Stage, Container, Sprite, useTick } from "@pixi/react";
import { useState } from "react";

function Bunny() {
  const [rotation, setRotation] = useState(0);

  useTick((delta) => {
    setRotation((r) => r + 0.1 * delta);
  });

  return (
    <Sprite
      image="https://pixijs.io/examples/examples/assets/bunny.png"
      anchor={0.5}
      rotation={rotation}
      scale={2}
    />
  );
}

function Game() {
  return (
    <Stage
      width={800}
      height={600}
      options={{
        backgroundColor: 0x1099bb,
        antialias: true,
      }}
    >
      <Container position={[400, 300]}>
        <Bunny />
      </Container>
    </Stage>
  );
}

export default Game;
