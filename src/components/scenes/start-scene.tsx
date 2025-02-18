import { Container, Text } from "@pixi/react";
import { useTextStyle } from "../../hooks/use-text-style";
import { STAGE_SIZE } from "../../constants";

export function StartScene() {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  const titleStyle = useTextStyle({ fontSize: 48 });
  const subtitleStyle = useTextStyle({ fontSize: 24 });

  return (
    <Container position={[stageWidth / 2, stageHeight / 2]} pivot={[0, 0]}>
      <Container>
        <Text text="PIXI INVADERS" anchor={[0.5, 0.5]} style={titleStyle} />
        <Text
          text="press any key to start"
          anchor={[0.5, 0.5]}
          y={60}
          style={subtitleStyle}
        />
      </Container>
    </Container>
  );
}
