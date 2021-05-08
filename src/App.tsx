import React from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";

import GameObject from "./components/GameObject";
import AssetManager from "./managers/Asset";

export default function App() {
  return (
    <Canvas>
      <AssetManager data={{ sprite: {}, sound: {} }}>
        <OrbitControls />
        <GameObject />
      </AssetManager>
    </Canvas>
  );
}
