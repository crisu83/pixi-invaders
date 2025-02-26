import { create } from "zustand";

const SOUND_EFFECTS = {
  MISSILE_1: "missile_01.wav",
  MISSILE_2: "missile_02.wav",
  EXPLOSION_1: "explosion_01.wav",
  EXPLOSION_2: "explosion_02.wav",
  VICTORY: "jingle_01.wav",
  GAME_OVER: "jingle_02.wav",
} as const;

type SoundEffect = keyof typeof SOUND_EFFECTS;

type AudioStore = Readonly<{
  // State
  sfxCache: Map<string, HTMLAudioElement>;
  sfxVolume: number;

  // Actions
  playSound: (effect: SoundEffect) => void;
  setSfxVolume: (volume: number) => void;
  preloadAudio: () => void;
}>;

export const useAudioStore = create<AudioStore>((set, get) => ({
  sfxCache: new Map(),
  sfxVolume: 0.1,

  playSound: (effect: SoundEffect) => {
    const audio = get().sfxCache.get(effect);
    if (!audio) return;

    // Clone and play the sound effect
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = get().sfxVolume;
    clone.play().catch(() => {
      // Ignore autoplay errors
    });
  },

  setSfxVolume: (volume: number) => {
    set({ sfxVolume: Math.max(0, Math.min(1, volume)) });
  },

  preloadAudio: () => {
    const newCache = new Map<string, HTMLAudioElement>();

    // Preload sound effects
    Object.entries(SOUND_EFFECTS).forEach(([key, file]) => {
      const audio = new Audio(`/audio/${file}`);
      audio.preload = "auto";
      newCache.set(key, audio);
    });

    set({ sfxCache: newCache });
  },
}));
