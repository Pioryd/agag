import React from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";

import GameWindow from "./components/GameWindow";
import Camera from "./components/Camera";
import GameObject from "./components/GameObject";
import AssetManager from "./managers/Asset";
import SceneManager from "./managers/Scene";

export default function App() {
  return (
    <GameWindow width={600} height={600}>
      <Camera>
        <Canvas>
          <AssetManager data={{ sprite: {}, sound: {} }}>
            <SceneManager>
              <OrbitControls />
              <GameObject />
            </SceneManager>
          </AssetManager>
        </Canvas>
      </Camera>
    </GameWindow>
  );
}
