import { Container } from "@pixi/react";
import { STAGE_SIZE } from "../constants";
import { TitleText, FinalScoreText, ActionText } from "./text";
import { useEffect } from "react";
import { useAudioStore } from "../stores/audio-store";

type VictorySceneProps = {
  score: number;
};

export function VictoryScene({ score }: VictorySceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;
  const playSound = useAudioStore((state) => state.playSound);

  useEffect(() => {
    playSound("VICTORY");
  }, [playSound]);

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]}>
      <Container position={[0, -60]}>
        <TitleText>VICTORY!</TitleText>
        <FinalScoreText score={score} y={60} />
        <ActionText y={120}>PRESS ENTER TO RESTART</ActionText>
      </Container>
    </Container>
  );
}
