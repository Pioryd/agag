import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";

import GameWindow from "./components/GameWindow";
import GameObject from "./components/GameObject";

import AssetManager from "./managers/Asset";
import SceneManager from "./managers/Scene";

export default function App() {
  return (
    <GameWindow width={600} height={600}>
      <Canvas>
        <AssetManager data={{ sprite: {}, sound: {} }}>
          <SceneManager>
            <OrbitControls />
            <GameObject />
          </SceneManager>
        </AssetManager>
      </Canvas>
    </GameWindow>
  );
}
