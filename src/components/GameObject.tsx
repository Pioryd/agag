import React from "react";
import { useFrame } from "react-three-fiber";
import type { Mesh } from "three";

export default function GameObject() {
  const mesh = React.useRef<Mesh>();

  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.03;
  });

  return (
    <mesh ref={mesh} scale={[2, 2, 2]}>
      <boxBufferGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}
