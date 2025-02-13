export type Point = [number, number];
export type Size = [number, number];
export type PlayerAnimationState = "IDLE" | "TILT_LEFT" | "TILT_RIGHT";

export interface GameEntity {
  id: number;
  position: Point;
}

export interface EnemyGridProps {
  enemies: GameEntity[];
  onUpdateEnemies: (enemies: GameEntity[]) => void;
  onMissileSpawn: (position: Point) => void;
}

export interface MissileProps {
  initialPosition: Point;
  onDestroy: () => void;
  direction?: Point;
  texture?: string;
}

export interface PlayerProps {
  initialPosition: Point;
  onMove: (velocity: Point) => void;
  onMissileSpawn: (position: Point) => void;
}
