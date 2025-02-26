import { Container } from "@pixi/react";
import { STAGE_SIZE } from "../constants";
import { TitleText, FinalScoreText, ActionText } from "./text";
import { useEffect } from "react";
import { useAudioStore } from "../stores/audio-store";

type GameOverSceneProps = {
  score: number;
};

export function GameOverScene({ score }: GameOverSceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const playSound = useAudioStore((state) => state.playSound);

  useEffect(() => {
    playSound("GAME_OVER");
  }, [playSound]);

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]}>
      <Container position={[0, -60]}>
        <TitleText>GAME OVER!</TitleText>
        <FinalScoreText score={score} y={60} />
        <ActionText y={120}>PRESS ENTER TO RESTART</ActionText>
      </Container>
    </Container>
  );
}
