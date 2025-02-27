import { useEffect, useState } from "react";
import { useAudioStore } from "../stores/audio-store";
import { useInputStore } from "../stores/input-store";
import { GameState } from "../types";
import { GameOverScene } from "./game-over-scene";
import { PlayScene } from "./play-scene";
import { StartScene } from "./start-scene";
import { VictoryScene } from "./victory-scene";

export function GameScene() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState(0);
  const { isActionActive, resetActiveKeys } = useInputStore();
  const { toggleMuted } = useAudioStore();

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

  // Handle music mute toggle
  useEffect(() => {
    const checkMusicToggle = () => {
      if (isActionActive("TOGGLE_MUSIC")) {
        toggleMuted();
      }
    };

    const interval = setInterval(checkMusicToggle, 100);
    return () => clearInterval(interval);
  }, [isActionActive, toggleMuted]);

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
