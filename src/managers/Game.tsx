import React from "react";
import { Canvas } from "react-three-fiber";

import useEventManager, {
  ValueType as EventManagerValueType
} from "../core/useEventManager";
import { Position } from "../core/types";

import Camera from "../components/Camera";

import { ApiCollidable } from "../behaviors/Collidable";

import { GameObjectApi } from "./GameObject";
import { EventTerminate } from "./Scene";

export interface GameApi {
  mapSize: [number, number];
  setMapSize: React.Dispatch<React.SetStateAction<[number, number]>>;
  eventManager: EventManagerValueType;
  isPositionWalkable: (position: Position) => boolean;
  addGameObjectApi: (api: GameObjectApi) => void;
  removeGameObjectApi: (api: GameObjectApi) => void;
  getGameObjectsApisByPosition: (position: Position) => GameObjectApi[];
}

export const GameContext = React.createContext<GameApi | null>(null);

export function useGame() {
  return React.useContext(GameContext) as GameApi;
}
interface Props {
  children: React.ReactNode;
}

export default function Game({ children }: Props) {
  const [mapSize, setMapSize] = React.useState<[number, number]>(() => [1, 1]);
  const [gameObjectsApi] = React.useState<Map<string, GameObjectApi[]>>(
    () => new Map()
  );

  const eventManager = useEventManager();

  React.useEffect(() => {
    return eventManager.add<EventTerminate>("Terminate", () => {
      gameObjectsApi.clear();
    });
  }, [eventManager, gameObjectsApi]);

  const addGameObjectApi = React.useCallback(
    (api) => {
      const { position } = api;
      const key = `${position.x}:${position.y}`;
      const list = gameObjectsApi.get(key) || [];
      list.push(api);
      gameObjectsApi.set(key, list);
    },
    [gameObjectsApi]
  );

  const removeGameObjectApi = React.useCallback(
    (api) => {
      const { position } = api;
      const key = `${position.x}:${position.y}`;
      const list = gameObjectsApi.get(key);
      list?.splice(list.indexOf(api), 1);
    },
    [gameObjectsApi]
  );

  const getGameObjectsApisByPosition = React.useCallback(
    (position) => {
      return (
        gameObjectsApi
          .get(`${position.x}:${position.y}`)
          ?.filter((obj) => obj.draw) || []
      );
    },
    [gameObjectsApi]
  );

  const isPositionWalkable = React.useCallback(
    (position: Position) => {
      return (
        getGameObjectsApisByPosition(position).filter((obj) =>
          obj.apiManager.get<ApiCollidable>("Collidable")
        ).length === 0
      );
    },
    [getGameObjectsApisByPosition]
  );

  const gameApi: GameApi = {
    mapSize,
    setMapSize,
    eventManager,
    isPositionWalkable,
    addGameObjectApi,
    removeGameObjectApi,
    getGameObjectsApisByPosition
  };

  return (
    <Camera>
      <Canvas
        camera={{
          position: [0, 0, 128],
          zoom: 40,
          near: 0.1,
          far: 128
        }}
        orthographic
        noEvents
        gl={{ antialias: false }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <GameContext.Provider value={gameApi}>{children}</GameContext.Provider>
      </Canvas>
    </Camera>
  );
}
