import React from "react";

import { GameObjectApi, useGameObject } from "../managers/GameObject";

import { Api } from "../core/useApi";
import { EventData } from "../core/useEventManager";

import { EventMoveEnd } from "./Moveable";

export type EventCollisionBegin = EventData<"CollisionBegin", GameObjectApi>;
export type EventCollisionEnd = EventData<"CollisionEnd", GameObjectApi>;

export type ApiCollidable = Api<
  "Collidable",
  {
    onCollisionBegin: (gameObjectApi: GameObjectApi) => void;
    onCollisionEnd: (gameObjectApi: GameObjectApi) => void;
  }
>;

export default function Collidable() {
  const gameObjectApi = useGameObject();
  const { id, eventManager, apiManager } = gameObjectApi;

  React.useLayoutEffect(() => {
    return apiManager.add<ApiCollidable>("Collidable", {
      onCollisionBegin(ref) {
        eventManager.emit<EventCollisionBegin>("CollisionBegin", ref);
      },
      onCollisionEnd(ref) {
        eventManager.emit<EventCollisionEnd>("CollisionEnd", ref);
      }
    });
  }, []);

  return null;
}
