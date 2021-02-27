import React from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";

import GameObject from "./GameObject";

export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <GameObject />
    </Canvas>
  );
}
