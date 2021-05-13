import React from "react";
import { useFrame } from "react-three-fiber";
import { Position } from "../core/types";
import useInput from "../core/useInput";
import { InteractableApi } from "./Interactable";
import { MoveableApi } from "./Moveable";

import { useGame } from "../managers/Game";
import { useGameObject } from "../managers/GameObject";

import usePath from "../core/usePath";
import usePointer from "../core/usePointer";

export default function Controller() {
  const { getGameObjectsApisByPosition, isPositionWalkable } = useGame();
  const { id, apiManager, position } = useGameObject();
  const input = useInput();
  const { findPath } = usePath();
  const [path, setPath] = React.useState<Position[]>([]);

  const keysIds = React.useRef({
    left: "",
    right: "",
    up: "",
    down: ""
  });

  React.useEffect(() => {
    keysIds.current.left = input.createEvent({ keys: ["ArrowLeft", "a"] });
    keysIds.current.right = input.createEvent({ keys: ["ArrowRight", "d"] });
    keysIds.current.up = input.createEvent({ keys: ["ArrowUp", "w"] });
    keysIds.current.down = input.createEvent({ keys: ["ArrowDown", "s"] });

    return () =>
      Object.keys(keysIds.current).forEach((id) => input.removeEvent(id));
  }, []);

  useFrame(() => {
    const direction = {
      x:
        -Number(input.isPressed(keysIds.current.left)) +
        Number(input.isPressed(keysIds.current.right)),
      y:
        Number(input.isPressed(keysIds.current.up)) -
        Number(input.isPressed(keysIds.current.down))
    };

    const nextPosition: Position = {
      x: position.x + direction.x,
      y: position.y + direction.y
    };

    if (
      (nextPosition.x === position.x && nextPosition.y === position.y) ||
      !apiManager.get<MoveableApi>("Moveable").canMove() ||
      (direction.x !== 0 &&
        direction.y !== 0 &&
        (!isPositionWalkable({ x: nextPosition.x, y: position.y }) ||
          !isPositionWalkable({ x: position.x, y: nextPosition.y })))
    ) {
      if (
        !input.isPressed(keysIds.current.left) &&
        !input.isPressed(keysIds.current.right) &&
        !input.isPressed(keysIds.current.up) &&
        !input.isPressed(keysIds.current.down)
      )
        apiManager.get<MoveableApi>("Moveable").movingRef.current = false;
      return;
    }

    apiManager.get<MoveableApi>("Moveable").movingRef.current = true;
    setPath([nextPosition]);
  });

  usePointer((event, pointer) => {
    if (event.button === 0) {
      try {
        const nextPath = findPath({ to: pointer });
        if (path.length > 0) nextPath.unshift(position);
        apiManager.get<MoveableApi>("Moveable").movingRef.current = true;
        setPath(nextPath);
      } catch {
        setPath([]);
      }
    }
  });

  React.useEffect(() => {
    if (
      !input.isPressed(keysIds.current.left) &&
      !input.isPressed(keysIds.current.right) &&
      !input.isPressed(keysIds.current.up) &&
      !input.isPressed(keysIds.current.down)
    )
      apiManager.get<MoveableApi>("Moveable").movingRef.current = false;
    if (!path.length) return;
    apiManager.get<MoveableApi>("Moveable").movingRef.current = true;

    (async () => {
      const [nextPosition] = path;
      if (position.x === nextPosition.x && position.y === nextPosition.y)
        return;

      let done = await apiManager
        .get<MoveableApi>("Moveable")
        ?.move(nextPosition);

      if (!done) {
        if (path.length === 1) {
          let objApis = getGameObjectsApisByPosition(nextPosition).filter(
            (objApi) => objApi.id !== id
          );
          for (const objApi of objApis)
            await apiManager
              .get<InteractableApi>("Interactable")
              ?.interactWith(objApi);

          done = true;
        }
      }

      if (done) {
        setPath(path.slice(1));
      }
    })();
  }, [path, apiManager, position, getGameObjectsApisByPosition, id]);

  return null;
}
