import { Stage } from "@pixi/react";
import { STAGE_SIZE } from "./constants";
import { GameScene } from "./components/game-scene";

export function App() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

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
      <GameScene />
    </Stage>
  );
}
