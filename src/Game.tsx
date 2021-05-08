import AssetManager, { Props as AssetManagerProps } from "./managers/Asset";
import GameManager from "./managers/Game";
import SceneManager, { Props as SceneManagerProps } from "./managers/Scene";
import GameWindow, { Props as GameWindowProps } from "./components/GameWindow";

export interface Props
  extends GameWindowProps,
    AssetManagerProps,
    SceneManagerProps {}

export default function Game({ width, height, data, map }: Props) {
  return (
    <GameWindow width={width} height={height}>
      <GameManager>
        <AssetManager data={data}>
          <SceneManager map={map} />
        </AssetManager>
      </GameManager>
    </GameWindow>
  );
}
