import React from "react";
import { useFrame, useThree } from "react-three-fiber";

import { EventInitialize } from "../managers/Scene";
import { useGame } from "../managers/Game";
import { useGameObject } from "../managers/GameObject";

import useInput from "../core/useInput";

const ZOOM = {
  min: 1,
  step: 0.5,
  max: 5
};

export default function Camera() {
  const { eventManager } = useGame();
  const { Object3dRef } = useGameObject();
  const input = useInput();
  const { camera } = useThree();
  const isReady = React.useRef(false);
  const zoomStep = React.useRef(2);

  React.useEffect(() => {
    input.createEvent({
      keys: ["="],
      callback: (e) => {
        e.preventDefault();
        zoomStep.current = Math.min(ZOOM.max, zoomStep.current + ZOOM.step);
      }
    });
    input.createEvent({
      keys: ["-"],
      callback: (e) => {
        e.preventDefault();
        zoomStep.current = Math.max(ZOOM.min, zoomStep.current - ZOOM.step);
      }
    });

    return eventManager.add<EventInitialize>("Initialize", () => {
      isReady.current = true;
    });
  }, []);

  useFrame(() => {
    if (Object3dRef.current == null) return;

    camera.position.setX(Object3dRef.current.position.x);
    camera.position.setY(Object3dRef.current.position.y);

    if (20 * zoomStep.current !== camera.zoom) {
      camera.zoom = 20 * zoomStep.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
