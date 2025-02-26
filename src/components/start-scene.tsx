import { Container } from "@pixi/react";
import { STAGE_SIZE } from "../constants";
import { TitleText, ActionText } from "./text";

export function StartScene() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]}>
      <Container position={[0, -30]}>
        <TitleText>PIXI INVADERS</TitleText>
        <ActionText y={60}>PRESS ANY KEY TO START</ActionText>
      </Container>
    </Container>
  );
}
