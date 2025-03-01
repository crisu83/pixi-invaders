import { create } from "zustand";
import { useInputStore } from "./input-store";

const BACKGROUND_MUSIC = "oblanka-ian_aisling.mp3";

const SOUNDS = {
  MISSILE_1: "missile_01.wav",
  MISSILE_2: "missile_02.wav",
  EXPLOSION_1: "explosion_01.wav",
  EXPLOSION_2: "explosion_02.wav",
  VICTORY: "jingle_01.wav",
  GAME_OVER: "jingle_02.wav",
} as const;

type SoundEffect = keyof typeof SOUNDS;

type AudioStore = Readonly<{
  // State
  soundCache: Map<string, HTMLAudioElement>;
  soundVolume: number;
  music: HTMLAudioElement | null;
  musicVolume: number;
  muted: boolean;

  // Actions
  playSound: (effect: SoundEffect) => void;
  setSoundVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  playMusic: () => void;
  stopMusic: () => void;
  toggleMuted: () => void;
  preloadAudio: () => void;
}>;

export const useAudioStore = create<AudioStore>((set, get) => ({
  soundCache: new Map(),
  soundVolume: 0.1,
  music: null,
  musicVolume: 0.1,
  muted: false,

  playSound: (effect: SoundEffect) => {
    const audio = get().soundCache.get(effect);
    if (!audio) return;

    // Clone and play the sound effect
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = get().soundVolume;
    clone.play().catch(() => {
      // Ignore autoplay errors
    });
  },

  setSoundVolume: (volume: number) => {
    set({ soundVolume: Math.max(0, Math.min(1, volume)) });
  },

  setMusicVolume: (volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    set({ musicVolume: newVolume });
    const music = get().music;
    if (music && !get().muted) {
      music.volume = newVolume;
    }
  },

  playMusic: () => {
    const music = get().music;
    if (!music) return;

    // Note: This should be called after user interaction due to browser autoplay policies
    music.volume = get().muted ? 0 : get().musicVolume;
    music.loop = true;
    music.play().catch(() => {
      // Ignore autoplay errors
    });
  },

  stopMusic: () => {
    const music = get().music;
    if (!music) return;

    music.pause();
    music.currentTime = 0;
  },

  toggleMuted: () => {
    const music = get().music;
    const isMuted = get().muted;

    set({ muted: !isMuted });

    if (music) {
      music.volume = isMuted ? get().musicVolume : 0;
    }
  },

  preloadAudio: () => {
    const newCache = new Map<string, HTMLAudioElement>();

    // Preload sound effects
    Object.entries(SOUNDS).forEach(([key, file]) => {
      const audio = new Audio(`/audio/${file}`);
      audio.preload = "auto";
      newCache.set(key, audio);
    });

    // Preload background music
    const music = new Audio(`/audio/${BACKGROUND_MUSIC}`);
    music.preload = "auto";

    set({ soundCache: newCache, music });

    // Subscribe to music toggle changes
    useInputStore.subscribe((state) => {
      const isMuted = state.isActionActive("TOGGLE_MUSIC");
      const music = get().music;
      if (music) {
        music.volume = isMuted ? 0 : get().musicVolume;
      }
    });
  },
}));
