import { Text } from "@pixi/react";
import { useTextStyle } from "../hooks/use-text-style";
import { PropsWithChildren } from "react";
import { Point } from "../types";

export function TitleText({
  children,
  y = 0,
}: PropsWithChildren<{ y?: number }>) {
  const style = useTextStyle({ fontSize: 48 });

  return (
    <Text
      text={children?.toString() ?? ""}
      anchor={[0.5, 0.5]}
      y={y}
      style={style}
    />
  );
}

export function FinalScoreText({ score, y }: { score: number; y: number }) {
  const style = useTextStyle({ fontSize: 24 });

  return (
    <Text
      text={`FINAL SCORE ${score.toString().padStart(4, "0")}`}
      anchor={[0.5, 0.5]}
      y={y}
      style={style}
    />
  );
}

export function PressAnyKeyText({ y }: { y: number }) {
  const style = useTextStyle({ fontSize: 16 });

  return (
    <Text
      text="press any key to restart"
      anchor={[0.5, 0.5]}
      y={y}
      style={style}
    />
  );
}

export function ScoreText({
  value,
  position,
}: {
  value: number;
  position: Point;
}) {
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
