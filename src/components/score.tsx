import { Text } from "@pixi/react";
import { useTextStyle } from "../hooks/use-text-style";
import { Point } from "../types";

export function Score({ value, position }: { value: number; position: Point }) {
  const style = useTextStyle({ fontSize: 24 });

  return (
    <Text
      text={`SCORE ${value.toString().padStart(4, "0")}`}
      position={position}
      style={style}
      anchor={[0, 0]}
    />
  );
}
