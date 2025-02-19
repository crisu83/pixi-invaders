import { useState, useEffect } from "react";
import { StartScene } from "./start-scene";
import { VictoryScene } from "./victory-scene";
import { GameOverScene } from "./game-over-scene";
import { PlayScene } from "./play-scene";

export type GameState = "START" | "PLAYING" | "VICTORY" | "GAME_OVER";

export function GameScene() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = () => {
      switch (gameState) {
        case "START":
        case "GAME_OVER":
        case "VICTORY":
          setGameState("PLAYING");
          setScore(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  switch (gameState) {
    case "START":
      return <StartScene />;
    case "VICTORY":
      return <VictoryScene score={score} />;
    case "GAME_OVER":
      return <GameOverScene score={score} />;
    case "PLAYING":
      return (
        <PlayScene
          onGameOver={(finalScore: number) => {
            setScore(finalScore);
            setGameState("GAME_OVER");
          }}
          onVictory={(finalScore: number) => {
            setScore(finalScore);
            setGameState("VICTORY");
          }}
        />
      );
  }
}
