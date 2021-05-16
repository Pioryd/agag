import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Wifi as WifiIcon, WifiOff as WifiOffIcon } from "@material-ui/icons";

import { useNetworkApi } from "../../managers/NetworkApi";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabIcon: {
      color: "inherit",
      height: 40,
      width: 40,
      margin: 10
    }
  })
);

export default function Page() {
  const classes = useStyles();

  const { loggedIn, reconnecting } = useNetworkApi();

  React.useEffect(() => console.log("loggedIn"), [loggedIn]);
  React.useEffect(() => console.log("reconnecting"), [reconnecting]);

  return (
    <>
      {loggedIn ? (
        <WifiIcon
          className={classes.tabIcon}
          style={{ color: reconnecting ? "orange" : "green" }}
        />
      ) : (
        <WifiOffIcon className={classes.tabIcon} style={{ color: "red" }} />
      )}
    </>
  );
}
