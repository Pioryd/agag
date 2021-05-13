import React from "react";

import { Position } from "../core/types";
import { ApiSprite } from "../core/Sprite";

import { useGameObject } from "../managers/GameObject";

import {
  MoveableApi,
  EventMoveBegin,
  EventMoveActive,
  EventMoveEnd
} from "./Moveable";

export const characterOffsetY = 0.25;

export default function CharacterScript() {
  const { position, apiManager, eventManager } = useGameObject();

  React.useEffect(() => {
    return eventManager.add<EventMoveBegin>("MoveBegin", ({ x }: Position) => {
      const deltaX = Math.max(-1, Math.min(1, x - position.x));
      deltaX && apiManager.get<ApiSprite>("Sprite").setFlipX(deltaX);
    });
  }, [position]);

  React.useEffect(() => {
    return eventManager.add<EventMoveActive>(
      "MoveActive",
      ({ x }: Position) => {
        const deltaX = Math.max(-1, Math.min(1, x - position.x));
        deltaX && apiManager.get<ApiSprite>("Sprite").setFlipX(deltaX);

        if (apiManager.get<MoveableApi>("Moveable").movingRef.current)
          apiManager.get<ApiSprite>("Sprite").setAnimation("move");
      }
    );
  }, [position]);

  React.useEffect(() => {
    return eventManager.add<EventMoveEnd>("MoveEnd", ({ x }: Position) => {
      if (!apiManager.get<MoveableApi>("Moveable").movingRef.current)
        apiManager.get<ApiSprite>("Sprite").setAnimation("idle");
    });
  }, [position]);

  return null;
}
