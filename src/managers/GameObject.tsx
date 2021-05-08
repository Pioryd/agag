import React from "react";
import { v4 as uuidv4 } from "uuid";

import useEventManager, {
  ValueType as EventManagerValueType
} from "../core/useEventManager";
import useApi, { ValueType as ApiValueType } from "../core/useApi";
import { Position, Layer } from "../core/types";

export type GameObjectApi = {
  id: string;
  layer: Layer;
  Object3dRef: React.RefObject<THREE.Group>;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  draw: Readonly<boolean>;
  setDraw: React.Dispatch<React.SetStateAction<boolean>>;
  eventManager: EventManagerValueType;
  apiManager: ApiValueType;
  forceUpdate: VoidFunction;
};

export const GameObjectContext = React.createContext<GameObjectApi | null>(
  null
);

export interface GameObjectProps {
  layer: Layer;
  draw?: boolean;
  position?: Position;
  children?: React.ReactNode;
}

export function useGameObject() {
  return React.useContext(GameObjectContext) as GameObjectApi;
}

export default function GameObject({
  layer,
  draw: initialDraw = true,
  position: initialPosition = { x: 0, y: 0 },
  children
}: GameObjectProps) {
  const idRef = React.useRef(uuidv4());
  const Object3dRef = React.useRef(null);

  const apiManager = useApi();
  const eventManager = useEventManager();

  const [position, setPosition] = React.useState<Position>(initialPosition);
  const [draw, setDraw] = React.useState(initialDraw);

  const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void;

  const gameObjectApi = React.useMemo<GameObjectApi>(
    () => ({
      id: idRef.current,
      layer,
      position,
      setPosition,
      draw,
      setDraw,
      eventManager,
      apiManager,
      forceUpdate,
      Object3dRef
    }),
    [
      layer,
      position,
      setPosition,
      draw,
      setDraw,
      eventManager,
      apiManager,
      forceUpdate
    ]
  );

  return (
    <GameObjectContext.Provider value={gameObjectApi}>
      <group ref={Object3dRef} position={[position.x, position.y, layer]}>
        {draw && children}
      </group>
    </GameObjectContext.Provider>
  );
}
