import { Graphics } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback } from "react";
import { GameEntity } from "@/types";
import { getSpriteRef } from "@/utils/entity-helpers";

type HitBoxOverlayProps = {
  entity: GameEntity;
  color?: number;
};

export function HitBoxOverlay({
  entity,
  color = 0xff0000,
}: HitBoxOverlayProps) {
  const draw = useCallback(
    (g: PixiGraphics) => {
      const sprite = getSpriteRef(entity).current;
      if (!sprite) return;

      const [width, height] = entity.size;

      g.clear();
      g.lineStyle(1, color, 0.5);
      g.drawRect(-width / 2, -height / 2, width, height);

      // Draw a dot at the center for reference
      g.beginFill(color, 0.5);
      g.drawCircle(0, 0, 2);
      g.endFill();
    },
    [entity, color]
  );

  return (
    <Graphics draw={draw} position={[entity.position[0], entity.position[1]]} />
  );
}
