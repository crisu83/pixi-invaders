import { Text } from "@pixi/react";
import { PropsWithChildren } from "react";
import { useTextStyle } from "../../hooks/use-text-style";
import { Point } from "../../types";

type TitleTextProps = PropsWithChildren<{ y?: number }>;

export function TitleText({ children, y = 0 }: TitleTextProps) {
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

type FinalScoreTextProps = {
  score: number;
  y: number;
};

export function FinalScoreText({ score, y }: FinalScoreTextProps) {
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

type ActionTextProps = PropsWithChildren<{
  y: number;
}>;

export function ActionText({ children, y }: ActionTextProps) {
  const style = useTextStyle({ fontSize: 16 });

  return (
    <Text
      text={children?.toString() ?? ""}
      anchor={[0.5, 0.5]}
      y={y}
      style={style}
    />
  );
}

type ScoreTextProps = {
  value: number;
  position: Point;
};

export function ScoreText({ value, position }: ScoreTextProps) {
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

type ComboTextProps = {
  combo: number;
  position: Point;
};

export function ComboText({ combo, position }: ComboTextProps) {
  const style = useTextStyle({ fontSize: 16 });
  const multiplier = Math.min(4, 1 + (combo - 1) * 0.5);
  const text = combo > 1 ? `${combo}x COMBO! (${multiplier.toFixed(1)}x)` : "";

  return (
    <Text
      text={text}
      tint={0xff9900}
      position={position}
      style={style}
      anchor={[0, 0]}
    />
  );
}
