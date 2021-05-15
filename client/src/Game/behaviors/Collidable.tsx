import React from "react";

import { GameObjectApi, useGameObject } from "../managers/GameObject";
import { useGame } from "../managers/Game";

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
  const { getGameObjectsApisByPosition } = useGame();
  const gameObjectApi = useGameObject();
  const { id, eventManager, apiManager } = gameObjectApi;

  React.useLayoutEffect(() => {
    return apiManager.add<ApiCollidable>("Collidable", {
      onCollisionBegin(api) {
        eventManager.emit<EventCollisionBegin>("CollisionBegin", api);
      },
      onCollisionEnd(api) {
        eventManager.emit<EventCollisionEnd>("CollisionEnd", api);
      }
    });
  }, []);

  React.useEffect(() => {
    return eventManager.add<EventMoveEnd>("MoveEnd", (position) => {
      getGameObjectsApisByPosition(position)
        .filter((objectApi) => objectApi.id !== id)
        .map((objectApi) =>
          objectApi.apiManager.get<ApiCollidable>("Collidable")
        )
        .forEach((collidable) => collidable?.onCollisionBegin(gameObjectApi));
    });
  }, []);

  return null;
}
