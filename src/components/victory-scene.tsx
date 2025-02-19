import { Container } from "@pixi/react";
import { STAGE_SIZE } from "../constants";
import { TitleText, FinalScoreText, PressAnyKeyText } from "./text";

export function VictoryScene({ score }: { score: number }) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]}>
      <Container position={[0, -60]}>
        <TitleText>VICTORY!</TitleText>
        <FinalScoreText score={score} y={60} />
        <PressAnyKeyText y={120} />
      </Container>
    </Container>
  );
}
