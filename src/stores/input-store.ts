import { create } from "zustand";
import { MISSILE_COOLDOWN, TOGGLE_COOLDOWN } from "../constants";

type InputAction =
  | "MOVE_LEFT"
  | "MOVE_RIGHT"
  | "SHOOT"
  | "BOOST"
  | "TOGGLE_STATS"
  | "ANY";

type InputBinding = {
  keys: string[];
  action: InputAction;
  cooldown?: number; // Optional cooldown in milliseconds
};

type InputStore = Readonly<{
  // State
  activeKeys: Set<string>;
  lastActionTime: Map<InputAction, number>;
  bindings: InputBinding[];

  // Actions
  isActionActive: (action: InputAction) => boolean;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  reset: () => void;
}>;

const DEFAULT_BINDINGS: readonly InputBinding[] = [
  { keys: ["ArrowLeft"], action: "MOVE_LEFT" },
  { keys: ["ArrowRight"], action: "MOVE_RIGHT" },
  { keys: ["Space"], action: "SHOOT", cooldown: MISSILE_COOLDOWN },
  { keys: ["ShiftLeft", "ShiftRight"], action: "BOOST" },
  { keys: ["Backquote"], action: "TOGGLE_STATS", cooldown: TOGGLE_COOLDOWN },
] as const;

const createInitialState = () => ({
  activeKeys: new Set<string>(),
  lastActionTime: new Map<InputAction, number>(
    ["MOVE_LEFT", "MOVE_RIGHT", "SHOOT", "BOOST", "TOGGLE_STATS", "ANY"].map(
      (action) => [action as InputAction, 0]
    )
  ),
  bindings: [...DEFAULT_BINDINGS],
});

export const useInputStore = create<InputStore>((set, get) => ({
  ...createInitialState(),

  isActionActive: (action: InputAction): boolean => {
    if (action === "ANY") {
      return get().activeKeys.size > 0;
    }

    const binding = get().bindings.find((b) => b.action === action);
    if (!binding) return false;

    const activeKeys = get().activeKeys;
    const isKeyPressed = binding.keys.some((key) => activeKeys.has(key));

    // For actions without cooldown, just return if the key is pressed
    if (!binding.cooldown) {
      return isKeyPressed;
    }

    // For actions with cooldown, check if enough time has passed
    const lastActionTime = get().lastActionTime.get(action) || 0;
    const now = Date.now();
    const isRecentAction = now - lastActionTime < binding.cooldown;

    // If the key is pressed and enough time has passed, update the last action time
    if (isKeyPressed && !isRecentAction) {
      set((state) => ({
        lastActionTime: new Map(state.lastActionTime).set(action, now),
      }));
      return true;
    }

    return false;
  },

  handleKeyDown: (e: KeyboardEvent) => {
    set((state) => {
      const newActiveKeys = new Set(Array.from(state.activeKeys));
      newActiveKeys.add(e.code);

      // Only update ANY action time
      const newLastActionTime = new Map(state.lastActionTime);
      newLastActionTime.set("ANY", Date.now());

      return {
        activeKeys: newActiveKeys,
        lastActionTime: newLastActionTime,
      };
    });
  },

  handleKeyUp: (e: KeyboardEvent) => {
    set((state) => {
      const newActiveKeys = new Set(Array.from(state.activeKeys));
      newActiveKeys.delete(e.code);
      return { activeKeys: newActiveKeys };
    });
  },

  reset: () => {
    set(createInitialState());
  },
}));
