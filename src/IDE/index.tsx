import SportsEsportsIcon from "@material-ui/icons/SportsEsports";

import Game from "../Game";

import Page from "./components/Page";

import data from "../__mockData/data";
import tiles from "../__mockData/map";
import objects from "../__mockData/objects";

export default function App() {
  return (
    <Page
      items={{
        Game1: {
          icon: SportsEsportsIcon,
          component: <Game data={data} map={{ tiles, objects }} />
        },
        Game2: {
          icon: SportsEsportsIcon,
          component: <Game data={data} map={{ tiles, objects }} />
        }
      }}
    />
  );
}
