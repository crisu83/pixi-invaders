import { Container } from "@pixi/react";
import { STAGE_SIZE } from "../constants";
import { TitleText, PressAnyKeyText } from "./text";

export function StartScene() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]}>
      <Container position={[0, -30]}>
        <TitleText>PIXI INVADERS</TitleText>
        <PressAnyKeyText y={60} />
      </Container>
    </Container>
  );
}
