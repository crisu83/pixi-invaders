import { Stage } from "@pixi/react";
import { useEffect } from "react";
import { GameScene } from "./components/game-scene";
import { InputManager } from "./components/input-manager";
import { STAGE_SIZE } from "./constants";
import { useAudioStore } from "./stores/audio-store";

export function App() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const preloadAudio = useAudioStore((state) => state.preloadAudio);

  useEffect(() => {
    preloadAudio();
  }, [preloadAudio]);

  return (
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
  );
}
