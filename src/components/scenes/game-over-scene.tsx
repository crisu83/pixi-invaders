import { Container } from "@pixi/react";
import { useEffect } from "react";
import { STAGE_SIZE } from "../../constants";
import { useAudioStore } from "../../stores/audio-store";
import { ActionText, FinalScoreText, TitleText } from "../ui/text";

type GameOverSceneProps = {
  score: number;
};

export function GameOverScene({ score }: GameOverSceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const { playSound, stopMusic } = useAudioStore();

  useEffect(() => {
    stopMusic();
    playSound("GAME_OVER");
  }, [playSound, stopMusic]);

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]}>
      <Container position={[0, -60]}>
        <TitleText>GAME OVER</TitleText>
        <FinalScoreText score={score} y={60} />
        <ActionText y={120}>PRESS ENTER TO RESTART</ActionText>
      </Container>
    </Container>
  );
}
