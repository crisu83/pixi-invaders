export type Point = [number, number];
export type Size = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";
export type GameState = "START" | "PLAYING" | "VICTORY" | "GAME_OVER";
export type ComponentType = "EXPLOSIVE";
export type EntityType = "PLAYER" | "ENEMY" | "MISSILE";

export type GameComponent = Readonly<{
  type: ComponentType;
}>;

export type ExplosiveComponent = GameComponent &
  Readonly<{
    type: "EXPLOSIVE";
    alive: boolean;
    texture: string;
  }>;

export type GameEntity = Readonly<{
  id: number;
  type: EntityType;
  position: Point;
  components: readonly GameComponent[];
}>;
