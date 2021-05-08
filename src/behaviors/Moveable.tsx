import React from "react";
import anime from "animejs";

import { useGameObject } from "../managers/GameObject";

import { Api } from "../core/useApi";
import { EventData } from "../core/useEventManager";
import { Position } from "../core/types";

export type Direction = -1 | 0 | 1;
export type MoveDirection = [Direction, Direction];
export type LookDirection = -1 | 1;

export type EventMoveBegin = EventData<"MoveBegin", Position>;
export type EventMoveActive = EventData<"MoveActive", Position>;
export type EventMoveEnd = EventData<"MoveEnd", Position>;
export type EventMoveUpdate = EventData<
  "MoveUpdate",
  {
    currentPosition: Position;
    nextPosition: Position;
    moveDirection: MoveDirection;
    lookDirection: LookDirection;
  }
>;

export type MoveableApi = Api<
  "Moveable",
  {
    canMove: () => boolean;
    move: (position: Position) => Promise<boolean>;
  }
>;

export default function Moveable() {
  const {
    position,
    setPosition,
    eventManager,
    Object3dRef,
    apiManager
  } = useGameObject();

  const canMove = React.useRef(true);
  const moveDirection = React.useRef<MoveDirection>([1, 1]);
  const lookDirection = React.useRef<LookDirection>(1);

  React.useLayoutEffect(() => {
    return apiManager.add<MoveableApi>("Moveable", {
      canMove() {
        return canMove.current;
      },
      async move(targetPosition) {
        if (!canMove.current) return false;

        eventManager.emit<EventMoveBegin>("MoveBegin", targetPosition);

        canMove.current = false;
        eventManager.emit<EventMoveActive>("MoveActive", targetPosition);

        if (Object3dRef.current) {
          anime.remove(Object3dRef.current.position);
          await anime({
            targets: Object3dRef.current.position,
            x: [position.x, targetPosition.x],
            y: [position.y, targetPosition.y],
            duration: 125,
            easing: "linear",
            begin() {
              const deltaX = (targetPosition.x - position.x) as Direction;
              const deltaY = (targetPosition.y - position.y) as Direction;

              moveDirection.current = [deltaX, deltaY];
              lookDirection.current = deltaX || lookDirection.current;

              setPosition({
                x: deltaX ? targetPosition.x : position.x,
                y: deltaY ? targetPosition.y : position.y
              });
            },
            update() {
              Object3dRef.current &&
                eventManager.emit<EventMoveUpdate>("MoveUpdate", {
                  currentPosition: Object3dRef.current.position,
                  nextPosition: targetPosition,
                  moveDirection: moveDirection.current,
                  lookDirection: lookDirection.current
                });
            }
          }).finished;
        }

        canMove.current = true;

        eventManager.emit<EventMoveEnd>("MoveEnd", targetPosition);

        return true;
      }
    });
  }, [position]);

  React.useEffect(() => {
    const node = Object3dRef.current;

    return () => {
      if (node) anime.remove(node.position);
    };
  }, [Object3dRef]);

  return null;
}
