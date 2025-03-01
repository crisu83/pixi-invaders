import { useEffect } from "react";
import { useAudioStore } from "@/stores/audio-store";
import { useDebugStore } from "@/stores/debug-store";
import { useInputStore } from "@/stores/input-store";

export function useToggles() {
  const onToggle = useInputStore((state) => state.onToggle);
  const { toggleStats } = useDebugStore();
  const { toggleMuted } = useAudioStore();

  useEffect(() => {
    return onToggle((action) => {
      switch (action) {
        case "TOGGLE_STATS":
          toggleStats();
          break;
        case "TOGGLE_MUSIC":
          toggleMuted();
          break;
      }
    });
  }, [onToggle, toggleStats, toggleMuted]);
}
