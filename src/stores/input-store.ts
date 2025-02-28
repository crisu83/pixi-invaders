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
  cooldown?: number; // Optional cooldown in milliseconds
};

type InputStore = Readonly<{
  // State
  activeKeys: Set<string>;
  lastActionTime: Map<InputAction, number>;
  keyDownTime: Map<string, number>; // Track when each key was pressed
  bindings: InputBinding[];

  // Actions
  isActionActive: (action: InputAction) => boolean;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  resetActiveKeys: () => void;
}>;

const DEFAULT_BINDINGS: readonly InputBinding[] = [
  { keys: ["ArrowLeft", "KeyA"], action: "MOVE_LEFT" },
  { keys: ["ArrowRight", "KeyD"], action: "MOVE_RIGHT" },
  { keys: ["Space"], action: "SHOOT", cooldown: MISSILE_COOLDOWN },
  { keys: ["ShiftLeft", "ShiftRight"], action: "BOOST" },
  { keys: ["Backquote"], action: "TOGGLE_STATS", cooldown: TOGGLE_COOLDOWN },
  { keys: ["KeyM"], action: "TOGGLE_MUSIC", cooldown: TOGGLE_COOLDOWN },
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
  keyDownTime: new Map<string, number>(),
  bindings: [...DEFAULT_BINDINGS],
};

export const useInputStore = create<InputStore>((set, get) => ({
  ...initialState,

  isActionActive: (action: InputAction): boolean => {
    if (action === "ANY") {
      return get().activeKeys.size > 0;
    }

    const binding = get().bindings.find((b) => b.action === action);
    if (!binding) return false;

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

  handleKeyDown: (e: KeyboardEvent) => {
    const now = Date.now();
    set((state) => {
      const newActiveKeys = new Set(Array.from(state.activeKeys));
      const newKeyDownTime = new Map(state.keyDownTime);
      newActiveKeys.add(e.code);

      // Only set the down time if it's not already set (avoid resetting on key repeat)
      if (!state.keyDownTime.has(e.code)) {
        newKeyDownTime.set(e.code, now);
      }

      // Only update ANY action time
      const newLastActionTime = new Map(state.lastActionTime);
      newLastActionTime.set("ANY", now);

      return {
        activeKeys: newActiveKeys,
        lastActionTime: newLastActionTime,
        keyDownTime: newKeyDownTime,
      };
    });
  },

  handleKeyUp: (e: KeyboardEvent) => {
    set((state) => {
      const newActiveKeys = new Set(Array.from(state.activeKeys));
      const newKeyDownTime = new Map(state.keyDownTime);
      newActiveKeys.delete(e.code);
      newKeyDownTime.delete(e.code);
      return {
        activeKeys: newActiveKeys,
        keyDownTime: newKeyDownTime,
      };
    });
  },

  resetActiveKeys: () => {
    set(initialState);
  },
}));
