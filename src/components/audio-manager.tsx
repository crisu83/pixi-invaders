import { useEffect } from "react";
import { useAudioStore } from "../stores/audio-store";

type AudioManagerProps = {
  children: React.ReactNode;
};

export function AudioManager({ children }: AudioManagerProps) {
  const preloadAudio = useAudioStore((state) => state.preloadAudio);

  useEffect(() => {
    preloadAudio();
  }, [preloadAudio]);

  return <>{children}</>;
}
