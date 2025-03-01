import { Stage } from "@pixi/react";
import { useEffect } from "react";
import { InputManager } from "@/components/core/input-manager";
import { GameScene } from "@/components/scenes/game-scene";
import { STAGE_SIZE } from "@/constants";
import { DebugProvider } from "@/contexts/debug-context";
import { useAudioStore } from "@/stores/audio-store";

export function App() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const preloadAudio = useAudioStore((state) => state.preloadAudio);

  useEffect(() => {
    preloadAudio();
  }, [preloadAudio]);

  return (
    <InputManager>
      <DebugProvider>
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
      </DebugProvider>
    </InputManager>
  );
}
