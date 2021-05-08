import Game from "./Game";

import useWindowSize from "./__mockData/useWindowSize";
import data from "./__mockData/data";
import tiles from "./__mockData/map";
import objects from "./__mockData/objects";

export default function App() {
  const [width, height] = useWindowSize();

  return (
    <Game width={width} height={height} data={data} map={{ tiles, objects }} />
  );
}
