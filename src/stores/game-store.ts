import { create } from "zustand";
import { GameEntity, Point } from "../types";
import { createEntity } from "../utils/entity-factory";
import {
  STAGE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
} from "../constants";

interface GameState {
  // Game status
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
  startTime: number;

  // Entities
  player: GameEntity;
  enemies: GameEntity[];
  playerMissiles: GameEntity[];
  enemyMissiles: GameEntity[];
  explosions: GameEntity[];
  velocity: Point;

  // Actions
  setScore: (score: number) => void;
  setGameStarted: (started: boolean) => void;
  setGameOver: (over: boolean) => void;
  setStartTime: (time: number) => void;
  setVelocity: (velocity: Point) => void;

  // Entity management
  initializeGame: () => void;
  addPlayerMissile: (missile: GameEntity) => void;
  addEnemyMissile: (missile: GameEntity) => void;
  addExplosion: (explosion: GameEntity) => void;
  removePlayerMissile: (id: number) => void;
  removeEnemyMissile: (id: number) => void;
  removeExplosion: (id: number) => void;
  removeEnemy: (id: number) => void;
  updatePlayer: (player: GameEntity) => void;
}

const [, stageHeight] = STAGE_SIZE;

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  score: 0,
  gameStarted: false,
  gameOver: false,
  startTime: 0,
  player: createEntity("PLAYER", [0, stageHeight / 3]),
  enemies: [],
  playerMissiles: [],
  enemyMissiles: [],
  explosions: [],
  velocity: [0, 0],

  // Actions
  setScore: (score) => set({ score }),
  setGameStarted: (gameStarted) => set({ gameStarted }),
  setGameOver: (gameOver) => set({ gameOver }),
  setStartTime: (startTime) => set({ startTime }),
  setVelocity: (velocity) => set({ velocity }),

  // Entity management
  initializeGame: () =>
    set((state) => {
      const newEnemies: GameEntity[] = [];
      for (const row of Array.from({ length: ENEMY_ROWS }, (_, i) => i)) {
        for (const col of Array.from(
          { length: ENEMIES_PER_ROW },
          (_, i) => i
        )) {
          const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
          const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
          newEnemies.push(createEntity("ENEMY", [x, y]));
        }
      }
      return {
        ...state,
        enemies: newEnemies,
        startTime: performance.now(),
        gameStarted: true,
        gameOver: false,
        score: 0,
        playerMissiles: [],
        enemyMissiles: [],
        explosions: [],
        velocity: [0, 0],
        player: createEntity("PLAYER", [0, stageHeight / 3]),
      };
    }),

  addPlayerMissile: (missile) =>
    set((state) => ({ playerMissiles: [...state.playerMissiles, missile] })),

  addEnemyMissile: (missile) =>
    set((state) => ({ enemyMissiles: [...state.enemyMissiles, missile] })),

  addExplosion: (explosion) =>
    set((state) => ({ explosions: [...state.explosions, explosion] })),

  removePlayerMissile: (id) =>
    set((state) => ({
      playerMissiles: state.playerMissiles.filter((m) => m.id !== id),
    })),

  removeEnemyMissile: (id) =>
    set((state) => ({
      enemyMissiles: state.enemyMissiles.filter((m) => m.id !== id),
    })),

  removeExplosion: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((e) => e.id !== id),
    })),

  removeEnemy: (id) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== id),
    })),

  updatePlayer: (player) => set({ player }),
}));
