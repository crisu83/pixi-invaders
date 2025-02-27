import { Stage } from "@pixi/react";
import { AudioManager } from "./components/audio-manager";
import { GameScene } from "./components/game-scene";
import { InputManager } from "./components/input-manager";
import { STAGE_SIZE } from "./constants";

export function App() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  return (
    <AudioManager>
      <InputManager>
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
      </InputManager>
    </AudioManager>
  );
}
