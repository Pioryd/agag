import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import LiveTvIcon from "@material-ui/icons/LiveTv";

import Game from "../Game";

import Page from "./components/Page";

import Sprites from "./views/Sprites";
import Assets from "./views/Assets";

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
        Sprites: {
          icon: LiveTvIcon,
          component: <Sprites />
        },
        Assets: {
          icon: ImageSearchIcon,
          component: <Assets />
        }
      }}
    />
  );
}
