import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { SvgIconComponent } from "@material-ui/icons";

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

  return (
    <div className={classes.page}>
      <Tabs forceRenderTabPanel={true}>
        <TabList>
          {Object.keys(items).map((key: string) => {
            const { icon: Icon } = items[key];
            return (
              <Tab key={"key-TabList-" + key} className={classes.tabList}>
                <Icon className={classes.tabIcon} />
              </Tab>
            );
          })}
        </TabList>

        {Object.keys(items).map((key: string) => (
          <TabPanel key={"key-TabPanel-" + key}>
            <div className={classes.content}>{items[key].component}</div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
