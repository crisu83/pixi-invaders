export type Point = [number, number];
export type Size = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";
export type GameState = "START" | "PLAYING" | "VICTORY" | "GAME_OVER";
export type ComponentType = "SPRITE" | "MOVEMENT" | "EXPLOSIVE";
export type EntityType = "PLAYER" | "ENEMY" | "MISSILE" | "EXPLOSION";
export type EntityVariant = "PLAYER" | "ENEMY";

export type GameComponent = Readonly<{
  type: ComponentType;
}>;

export type GameEntity = Readonly<{
  id: number;
  type: EntityType;
  components: readonly GameComponent[];
}>;
