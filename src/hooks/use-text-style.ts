import { TextStyle, TextStyleFontWeight } from "pixi.js";

const baseStyle = {
  fill: "white",
  fontFamily: "Inter",
  fontWeight: "700" as TextStyleFontWeight,
  align: "center" as const,
  letterSpacing: 2,
};

export function useTextStyle(overrides: Partial<TextStyle>) {
  return new TextStyle({
    ...baseStyle,
    ...overrides,
  });
}
