import { useEffect } from "react";
import { useAudioStore } from "@/stores/audio-store";

export function useMusic() {
  const { playMusic, stopMusic } = useAudioStore();

  useEffect(() => {
    playMusic();
    return () => stopMusic();
  }, [playMusic, stopMusic]);
}
