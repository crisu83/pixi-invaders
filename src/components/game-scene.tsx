import { useState, useEffect } from "react";
import { GameState } from "../types";
import { StartScene } from "./scenes/start-scene";
import { GameOverScene } from "./scenes/game-over-scene";
import { PlayScene } from "./scenes/play-scene";

export function GameScene() {
  const [gameState, setGameState] = useState<GameState>("START");

  useEffect(() => {
    const handleKeyPress = () => {
      switch (gameState) {
        case "START":
          setGameState("PLAYING");
          break;
        case "GAME_OVER":
          setGameState("PLAYING");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  switch (gameState) {
    case "START":
      return <StartScene />;
    case "GAME_OVER":
      return <GameOverScene />;
    case "PLAYING":
      return <PlayScene onGameOver={() => setGameState("GAME_OVER")} />;
  }
}
