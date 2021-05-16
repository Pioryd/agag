import { Tab } from "react-tabs";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
    tabIcon: {
      color: "inherit",
      height: 40,
      width: 40,
      margin: 10
    }
  })
);

export default function DesktopTabs({ items, tabIndex, setTabIndex }: Props) {
  const classes = useStyles();

  return (
    <>
      {Object.keys(items).map((key: string, index) => {
        const { icon: Icon } = items[key];
        return (
          <Tab key={"key-TabList-" + key} className={classes.tab}>
            <Icon
              style={{ color: tabIndex === index ? "white" : "#808080" }}
              className={classes.tabIcon}
              onClick={() => setTabIndex(index)}
            />
          </Tab>
        );
      })}
    </>
  );
}
