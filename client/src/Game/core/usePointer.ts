import React from "react";
import { useThree, useFrame } from "react-three-fiber";
import * as THREE from "three";

import { Position } from "./types";

export default function usePointer(
  callback: (event: PointerEvent, pointer: Position) => void
) {
  const {
    camera,
    mouse,
    gl: { domElement }
  } = useThree();

  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });

  const getPointer = React.useCallback(
    (mouse: THREE.Vector2, camera: THREE.Camera) => {
      const vector3 = new THREE.Vector3();
      const { x, y } = vector3.set(mouse.x, mouse.y, 1).unproject(camera);
      return { x: Math.round(x), y: Math.round(y) };
    },
    []
  );

  useFrame(() => {
    const currentPosition = getPointer(mouse, camera);
    if (position.x === currentPosition.x && position.y === currentPosition.y)
      return;
    setPosition(currentPosition);
  });

  React.useEffect(() => {
    const handleClick = (e: PointerEvent) => callback(e, position);

    domElement.addEventListener("pointerup", handleClick);
    return () => domElement.removeEventListener("pointerup", handleClick);
  }, [callback, domElement]);
}
