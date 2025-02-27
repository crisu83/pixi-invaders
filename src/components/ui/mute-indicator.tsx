import { Text } from "@pixi/react";
import { useTextStyle } from "../../hooks/use-text-style";
import { Point } from "../../types";

type MuteIndicatorProps = {
  position: Point;
  visible: boolean;
};

export function MuteIndicator({ position, visible }: MuteIndicatorProps) {
  const style = useTextStyle({ fontSize: 16 });

  return (
    visible && (
      <Text
        text="🔇 MUTED"
        position={position}
        style={style}
        anchor={[1, 0]} // Align to top-right
      />
    )
  );
}
