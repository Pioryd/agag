import React from "react";
import { useFrame, useThree } from "react-three-fiber";

import { EventInitialize } from "../managers/Scene";
import { useGame } from "../managers/Game";
import { useGameObject } from "../managers/GameObject";

import useInput from "../core/useInput";

const ZOOMS = [32, 48, 64, 80, 96, 112, 128];

export default function Camera() {
  const { eventManager } = useGame();
  const { Object3dRef } = useGameObject();
  const input = useInput();
  const { camera } = useThree();
  const isReady = React.useRef(false);
  const zoomLevel = React.useRef(3); // 80

  React.useEffect(() => {
    input.createEvent({
      keys: ["="],
      callback: (e) => {
        e.preventDefault();
        zoomLevel.current = Math.min(ZOOMS.length - 1, zoomLevel.current + 1);
      }
    });
    input.createEvent({
      keys: ["-"],
      callback: (e) => {
        e.preventDefault();
        zoomLevel.current = Math.max(0, zoomLevel.current - 1);
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

    if (ZOOMS[zoomLevel.current] !== camera.zoom) {
      camera.zoom = ZOOMS[zoomLevel.current];
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
