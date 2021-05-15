import AssetManager, { Props as AssetManagerProps } from "./managers/Asset";
import GameManager from "./managers/Game";
import SceneManager, { Props as SceneManagerProps } from "./managers/Scene";
import GameWindow from "./components/GameWindow";

export interface Props extends AssetManagerProps, SceneManagerProps {}

export default function Game({ data, map }: Props) {
  return (
    <GameWindow>
      <GameManager>
        <AssetManager data={data}>
          <SceneManager map={map} />
        </AssetManager>
      </GameManager>
    </GameWindow>
  );
}
