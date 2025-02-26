import { useState, useEffect } from "react";
import { StartScene } from "./start-scene";
import { VictoryScene } from "./victory-scene";
import { GameOverScene } from "./game-over-scene";
import { PlayScene } from "./play-scene";
import { GameState } from "../types";
import { useInputStore } from "../stores/input-store";

export function GameScene() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const { isActionActive, resetActiveKeys } = useInputStore();

  useEffect(() => {
    const checkSceneTransition = () => {
      if (
        gameState === "START"
          ? isActionActive("ANY")
          : isActionActive("RESTART")
      ) {
        switch (gameState) {
          case "START":
          case "GAME_OVER":
          case "VICTORY":
            setGameState("PLAYING");
            setScore(0);
            resetActiveKeys();
            break;
        }
      }
    };

    const interval = setInterval(checkSceneTransition, 100);
    return () => clearInterval(interval);
  }, [gameState, isActionActive, resetActiveKeys]);

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
