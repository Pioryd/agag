import React from "react";

import { GameObjectApi, useGameObject } from "../managers/GameObject";

import { Api } from "../core/useApi";
import { EventData } from "../core/useEventManager";

export type EventOnInteraction = EventData<"OnInteraction", GameObjectApi>;

export type InteractableApi = Api<
  "Interactable",
  {
    interactWith: (gameObjectApi: GameObjectApi) => Promise<boolean>;
    onInteractFrom: (gameObjectApi: GameObjectApi) => Promise<void>;
  }
>;

export default function Interactable() {
  const gameObjectApi = useGameObject();
  const { eventManager: eventManagerOfGameObject, apiManager } = gameObjectApi;

  const lastInteractTime = React.useRef(0);

  React.useLayoutEffect(() => {
    return apiManager.add<InteractableApi>("Interactable", {
      async interactWith(gameObjectApi) {
        const interactableApi = gameObjectApi.apiManager.get<InteractableApi>(
          "Interactable"
        );

        if (!interactableApi) return false;

        const now = Date.now();
        if (now - lastInteractTime.current <= 100) return false;
        lastInteractTime.current = now;

        await interactableApi.onInteractFrom(gameObjectApi);

        return true;
      },
      async onInteractFrom(gameObject) {
        await eventManagerOfGameObject.emit<EventOnInteraction>(
          "OnInteraction",
          gameObject
        );
      }
    });
  }, []);

  return null;
}
