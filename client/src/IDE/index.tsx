import {
  SportsEsports as SportsEsportsIcon,
  ImageSearch as ImageSearchIcon,
  LiveTv as LiveTvIcon,
  People as PeopleIcon
} from "@material-ui/icons";

import data from "../__mockData/data";
import tiles from "../__mockData/map";
import objects from "../__mockData/objects";

import Game from "../Game";

import NetworkManager from "./managers/NetworkApi";

import Page from "./components/Page";

import Sprites from "./views/Sprites";
import Assets from "./views/Assets";
import UsersOnline from "./views/UsersOnline";

export default function IDE() {
  return (
    <NetworkManager>
      <Page
        items={{
          Game: {
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
          },
          UsersOnline: {
            icon: PeopleIcon,
            component: <UsersOnline />
          }
        }}
      />
    </NetworkManager>
  );
}
