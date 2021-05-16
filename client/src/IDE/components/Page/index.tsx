import React from "react";
import { Tabs, TabList, TabPanel } from "react-tabs";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import { SvgIconComponent } from "@material-ui/icons";

import { useNetworkApi } from "../../managers/NetworkApi";

import LoginPanel from "./LoginPanel";
import ConnectingPanel from "./ConnectingPanel";
import ConnectedStatusIcon from "./ConnectedStatusIcon";
import DesktopTabs from "./DesktopTabs";
import MobileTabs from "./MobileTabs";

export interface Item {
  icon: SvgIconComponent;
  component: JSX.Element;
}

export interface Props {
  items: { [key: string]: Item };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      clear: "both",
      border: "none",
      fontFamily: "sans-serif",
      background: "white",
      color: "white",
      height: "100vh",
      boxSizing: "border-box",
      overflow: "none"
    },
    content: {
      border: "none",
      margin: 0,
      padding: 0,
      height: "100%",
      width: "100%",
      backgroundColor: "white",
      textAlign: "center",
      position: "absolute",
      overflow: "auto",
      display: "flex",
      alignItems: "stretch",
      "@media (min-width: 768px)": {
        width: "calc(100% - 60px)"
      }
    },
    tabList: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    },
    tabIcon: {
      color: "inherit",
      height: 40,
      width: 40,
      margin: 10
    }
  })
);

export default function Page({ items }: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));

  const { loggedIn, reconnecting } = useNetworkApi();

  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <div className={classes.page}>
      <Tabs
        defaultIndex={0}
        forceRenderTabPanel={true}
        selectedIndex={tabIndex}
      >
        <TabList>
          <ConnectedStatusIcon />

          {mobile ? (
            <MobileTabs
              items={items}
              tabIndex={tabIndex}
              setTabIndex={setTabIndex}
            />
          ) : (
            <DesktopTabs
              items={items}
              tabIndex={tabIndex}
              setTabIndex={setTabIndex}
            />
          )}
        </TabList>

        {Object.keys(items).map((key: string) => (
          <TabPanel key={"key-TabPanel-" + key}>
            <div className={classes.content}>
              {loggedIn ? (
                items[key].component
              ) : (
                <>{reconnecting ? <ConnectingPanel /> : <LoginPanel />}</>
              )}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
