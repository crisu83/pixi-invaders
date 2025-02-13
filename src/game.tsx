import { Stage, Container } from "@pixi/react";
import { useRef, useCallback, useState, useEffect } from "react";
import {
  Point,
  STAGE_SIZE,
  ENEMY_ROWS,
  ENEMIES_PER_ROW,
  ENEMY_SPACING,
} from "./constants";
import { Background } from "./components/background";
import { Player } from "./components/player";
import { EnemyGrid } from "./components/enemy-grid";

export function Game() {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const velocityRef = useRef<Point>([0, 0]);
  const [enemies, setEnemies] = useState<{ id: number; position: Point }[]>([]);
  const nextEnemyId = useRef(0);

  // Spawn enemy grid on mount
  useEffect(() => {
    const newEnemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMIES_PER_ROW; col++) {
        const x = (col - (ENEMIES_PER_ROW - 1) / 2) * ENEMY_SPACING[0];
        const y = -stageHeight / 3 + row * ENEMY_SPACING[1];
        newEnemies.push({
          id: nextEnemyId.current++,
          position: [x, y] as Point,
        });
      }
    }
    setEnemies(newEnemies);
  }, [stageHeight]);

  const handlePlayerMove = useCallback((velocity: Point) => {
    velocityRef.current = velocity;
  }, []);

  // Calculate player's initial position
  const playerInitialPosition: Point = [0, stageHeight / 3]; // Move it down by 1/3 of stage height

  const handleEnemyDestroyed = () => {
    // Implementation of handleEnemyDestroyed function
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      options={{
        backgroundColor: 0x1a1a1a,
        antialias: true,
        eventMode: "static",
      }}
    >
      <Background velocityRef={velocityRef} />
      <Container position={[stageWidth / 2, stageHeight / 2]}>
        <EnemyGrid
          enemies={enemies}
          onEnemyDestroyed={handleEnemyDestroyed}
          onUpdateEnemies={setEnemies}
        />
        <Player
          initialPosition={playerInitialPosition}
          onMove={handlePlayerMove}
        />
      </Container>
    </Stage>
  );
}
