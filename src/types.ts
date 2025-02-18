export type Point = [number, number];
export type Size = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";
export type GameState = "START" | "PLAYING" | "GAME_OVER";
export type ComponentType = "EXPLOSIVE";
export type EntityType = "PLAYER" | "ENEMY" | "MISSILE";

export interface GameComponent {
  type: ComponentType;
}

export interface ExplosiveComponent extends GameComponent {
  type: "EXPLOSIVE";
  alive: boolean;
  texture?: string;
  onExplode?: () => void;
}

export interface GameEntity {
  id: number;
  type: EntityType;
  position: Point;
  components?: GameComponent[];
}
