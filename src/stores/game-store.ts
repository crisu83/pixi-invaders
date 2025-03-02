import { create } from "zustand";
import {
  ENEMIES_PER_ROW,
  ENEMY_ROWS,
  ENEMY_SPACING,
  STAGE_SIZE,
} from "@/constants";
import {
  PlayerEntity,
  EnemyEntity,
  MissileEntity,
  ExplosionEntity,
} from "@/types";
import { createEntity } from "@/utils/entity-factory";

const [, stageHeight] = STAGE_SIZE;

type GameState = Readonly<{
  // Game state
  gameStarted: boolean;
  gameOver: boolean;

  // Entities
  player: PlayerEntity | null;
  enemies: EnemyEntity[];
  missiles: MissileEntity[];
  explosions: ExplosionEntity[];

  // Game actions
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Player actions
  updatePlayer: (player: PlayerEntity) => void;
  removePlayer: () => void;

  // Enemy actions
  removeEnemy: (id: number) => void;
  updateEnemies: (enemies: EnemyEntity[]) => void;

  // Missile actions
  addMissile: (missile: MissileEntity) => void;
  updateMissile: (missile: MissileEntity) => void;
  removeMissile: (id: number) => void;

  // Explosion actions
  addExplosion: (explosion: ExplosionEntity) => void;
  removeExplosion: (id: number) => void;
}>;

const spawnEnemies = (): EnemyEntity[] => {
  const enemies: EnemyEntity[] = [];
  for (const row of Array.from({ length: ENEMY_ROWS }, (_, i) => i)) {
    for (const col of Array.from({ length: ENEMIES_PER_ROW }, (_, i) => i)) {
      const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
      const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
      enemies.push(createEntity("ENEMY", [x, y]) as EnemyEntity);
    }
  }
  return enemies;
};

const initialState = {
  // Game state
  gameStarted: false,
  gameOver: false,

  // Entities
  player: null,
  enemies: [] as EnemyEntity[],
  missiles: [] as MissileEntity[],
  explosions: [] as ExplosionEntity[],
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // Game actions
  startGame: () => set({ gameStarted: true, gameOver: false }),
  endGame: () => set({ gameOver: true }),
  resetGame: () =>
    set({
      ...initialState,
      player: createEntity("PLAYER", [0, stageHeight / 3]) as PlayerEntity,
      enemies: spawnEnemies(),
      gameStarted: true,
      gameOver: false,
    }),

  // Player actions
  updatePlayer: (player) => set({ player }),
  removePlayer: () => set({ player: null }),

  // Enemy actions
  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== id),
    })),
  updateEnemies: (enemies) => set({ enemies }),

  // Missile actions
  addMissile: (missile) =>
    set((state) => ({
      missiles: [...state.missiles, missile],
    })),
  updateMissile: (missile) =>
    set((state) => ({
      missiles: state.missiles.map((m) => (m.id === missile.id ? missile : m)),
    })),
  removeMissile: (id) =>
    set((state) => ({
      missiles: state.missiles.filter((m) => m.id !== id),
    })),

  // Explosion actions
  addExplosion: (explosion) =>
    set((state) => ({
      explosions: [...state.explosions, explosion],
    })),
  removeExplosion: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((e) => e.id !== id),
    })),
}));
