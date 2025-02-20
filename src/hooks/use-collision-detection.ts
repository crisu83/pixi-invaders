import { GameEntity, Size } from "../types";
import { getSpriteRef } from "../utils/components";

export function useCollisionDetection() {
  return (
    entity1: GameEntity,
    entity2: GameEntity,
    size1: Size,
    size2: Size
  ) => {
    const spriteRef1 = getSpriteRef(entity1);
    const spriteRef2 = getSpriteRef(entity2);
    if (!spriteRef1.current || !spriteRef2.current) return false;

    const [width1, height1] = size1;
    const [width2, height2] = size2;

    const bounds1 = {
      left: spriteRef1.current.x - width1 / 2,
      right: spriteRef1.current.x + width1 / 2,
      top: spriteRef1.current.y - height1 / 2,
      bottom: spriteRef1.current.y + height1 / 2,
    };

    const bounds2 = {
      left: spriteRef2.current.x - width2 / 2,
      right: spriteRef2.current.x + width2 / 2,
      top: spriteRef2.current.y - height2 / 2,
      bottom: spriteRef2.current.y + height2 / 2,
    };

    return (
      bounds1.left < bounds2.right &&
      bounds1.right > bounds2.left &&
      bounds1.top < bounds2.bottom &&
      bounds1.bottom > bounds2.top
    );
  };
}
