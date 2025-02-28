import { Sprite } from "pixi.js";
import { MutableRefObject } from "react";
import { GameEntity } from "@/types";

export const getSpriteRef = (
  entity: GameEntity
): MutableRefObject<Sprite | null> => {
  return entity.spriteRef;
};
