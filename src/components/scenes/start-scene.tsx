import { Container } from "@pixi/react";
import { ActionText, TitleText } from "@/components/ui/text";
import { STAGE_SIZE } from "@/constants";

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
