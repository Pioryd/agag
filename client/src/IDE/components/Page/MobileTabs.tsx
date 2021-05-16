import React from "react";
import { Tab } from "react-tabs";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SwipeableDrawer, IconButton } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import { Item } from ".";

export interface Props {
  items: { [key: string]: Item };
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tab: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    },
    onIcon: {
      height: 40,
      width: 40,
      margin: 10,
      color: "white"
    },
    offIcon: {
      height: 40,
      width: 40,
      margin: 10,
      color: "#808080"
    },
    drawerContainer: {
      width: "auto",
      backgroundColor: "#2c2c2c"
    },
    openButton: {
      color: theme.palette.primary.contrastText
    },
    closeButton: {
      position: "absolute",
      right: 20,
      top: 10,
      color: theme.palette.primary.contrastText
    }
  })
);

export default function DesktopTabs({ items, tabIndex, setTabIndex }: Props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  return (
    <>
      {
        // Display first only current icon on TabBar
        Object.keys(items)
          .filter((value, index) => index === tabIndex)
          .map((key: string, index) => {
            const { icon: Icon } = items[key];
            return (
              <Tab key={"key-TabList-" + key} className={classes.tab}>
                <Icon
                  className={classes.onIcon}
                  onClick={() => setTabIndex(index)}
                />
              </Tab>
            );
          })
      }

      {!open ? (
        // If closed display only open button
        <IconButton
          className={classes.openButton}
          aria-label="open drawer"
          edge="end"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        // If open drawer, then show rest Icons
        <SwipeableDrawer
          anchor="top"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <div
            className={classes.drawerContainer}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <IconButton
              aria-label="close drawer"
              edge="end"
              className={classes.closeButton}
            >
              <MenuIcon />
            </IconButton>

            {Object.keys(items)
              .filter((value, index) => index !== tabIndex)
              .map((key: string, index) => {
                const { icon: Icon } = items[key];
                return (
                  <Tab key={"key-TabList-" + key} className={classes.tab}>
                    <Icon
                      className={classes.offIcon}
                      onClick={() =>
                        // Because of filter indexes changed
                        setTabIndex(index >= tabIndex ? index + 1 : index)
                      }
                    />
                  </Tab>
                );
              })}
          </div>
        </SwipeableDrawer>
      )}
    </>
  );
}
