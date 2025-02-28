import { create } from "zustand";
import { MISSILE_COOLDOWN, TOGGLE_COOLDOWN } from "@/constants";

type InputAction =
  | "MOVE_LEFT"
  | "MOVE_RIGHT"
  | "SHOOT"
  | "BOOST"
  | "TOGGLE_STATS"
  | "TOGGLE_MUSIC"
  | "RESTART"
  | "ANY";

type InputBinding = {
  keys?: string[];
  action: InputAction;
  cooldown?: number;
  isToggle?: boolean;
};

type InputStore = Readonly<{
  // State
  activeKeys: Set<string>;
  lastActionTime: Map<InputAction, number>;
  bindings: InputBinding[];
  toggleListeners: Set<(action: InputAction) => void>;

  // Actions
  isActionActive: (action: InputAction) => boolean;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  resetActiveKeys: () => void;
  onToggle: (callback: (action: InputAction) => void) => () => void;
}>;

const DEFAULT_BINDINGS: readonly InputBinding[] = [
  { keys: ["ArrowLeft", "KeyA"], action: "MOVE_LEFT" },
  { keys: ["ArrowRight", "KeyD"], action: "MOVE_RIGHT" },
  { keys: ["Space"], action: "SHOOT", cooldown: MISSILE_COOLDOWN },
  { keys: ["ShiftLeft", "ShiftRight"], action: "BOOST" },
  {
    keys: ["Backquote"],
    action: "TOGGLE_STATS",
    cooldown: TOGGLE_COOLDOWN,
    isToggle: true,
  },
  {
    keys: ["KeyM"],
    action: "TOGGLE_MUSIC",
    cooldown: TOGGLE_COOLDOWN,
    isToggle: true,
  },
  { keys: ["Enter"], action: "RESTART" },
] as const;

const initialState = {
  activeKeys: new Set<string>(),
  lastActionTime: new Map<InputAction, number>(
    [
      "MOVE_LEFT",
      "MOVE_RIGHT",
      "SHOOT",
      "BOOST",
      "TOGGLE_STATS",
      "TOGGLE_MUSIC",
      "ANY",
      "RESTART",
    ].map((action) => [action as InputAction, 0])
  ),
  bindings: [...DEFAULT_BINDINGS],
  toggleListeners: new Set<(action: InputAction) => void>(),
};

export const useInputStore = create<InputStore>((set, get) => ({
  ...initialState,

  isActionActive: (action: InputAction): boolean => {
    if (action === "ANY") {
      return get().activeKeys.size > 0;
    }

    const binding = get().bindings.find((b) => b.action === action);
    if (!binding || binding.isToggle) return false;

    const activeKeys = get().activeKeys;
    const now = Date.now();

    // Check if any key is pressed for bindings without specific keys
    const isKeyPressed = !binding.keys
      ? activeKeys.size > 0
      : binding.keys.some((key) => activeKeys.has(key));

    if (!isKeyPressed) return false;

    // Check cooldown if specified
    if (binding.cooldown) {
      const lastActionTime = get().lastActionTime.get(action) || 0;
      const isRecentAction = now - lastActionTime < binding.cooldown;

      if (isRecentAction) return false;

      // Update last action time
      set((state) => ({
        lastActionTime: new Map(state.lastActionTime).set(action, now),
      }));
    }

    return true;
  },

  onToggle: (callback) => {
    get().toggleListeners.add(callback);
    return () => get().toggleListeners.delete(callback);
  },

  handleKeyDown: (e: KeyboardEvent) => {
    const now = Date.now();
    const state = get();

    // Check for toggle actions first
    const toggleBinding = state.bindings.find(
      (b) => b.isToggle && b.keys?.includes(e.code)
    );

    if (toggleBinding && !e.repeat) {
      // Ignore repeat events for toggles
      const lastActionTime =
        state.lastActionTime.get(toggleBinding.action) || 0;
      if (now - lastActionTime >= (toggleBinding.cooldown || 0)) {
        // Update last action time for the toggle
        set((state) => ({
          lastActionTime: new Map(state.lastActionTime).set(
            toggleBinding.action,
            now
          ),
        }));
        // Notify listeners
        state.toggleListeners.forEach((listener) =>
          listener(toggleBinding.action)
        );
        return;
      }
    }

    // Handle regular key press
    set((state) => {
      const newActiveKeys = new Set(Array.from(state.activeKeys));
      newActiveKeys.add(e.code);
      return { activeKeys: newActiveKeys };
    });
  },

  handleKeyUp: (e: KeyboardEvent) => {
    set((state) => {
      const newActiveKeys = new Set(Array.from(state.activeKeys));
      newActiveKeys.delete(e.code);
      return { activeKeys: newActiveKeys };
    });
  },

  resetActiveKeys: () => {
    set(initialState);
  },
}));
