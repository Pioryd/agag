import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import Sprite from "../../components/Sprite";

import data from "../../../__mockData/data";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f3f3f3",
      flexGrow: 1,
      padding: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(0)
      }
    },
    cardContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row"
    },
    imagePanel: {
      width: 100,
      height: 100,
      display: "flex",
      alignItems: "center",
      flexDirection: "column"
    },
    dataPanel: {
      width: "50%"
    },
    textField: {
      paddingBottom: 10
    }
  })
);

export default function Sprites() {
  const classes = useStyles();

  const [sprites] = React.useState(() => {
    const spritesMap: { [key: string]: any } = {};

    const getSprites = (objects: any) => {
      for (const [name, obj] of Object.entries(objects)) {
        if ("url" in (obj as Object)) spritesMap[name] = obj;
        else getSprites(obj);
      }
    };
    getSprites(data);

    return spritesMap;
  });

  return (
    <Box className={classes.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        {Object.keys(sprites).map((spriteName: string) => {
          const sprite = sprites[spriteName];
          if (!sprite?.animations) return null;

          return Object.keys(sprite.animations).map((animationName) => {
            const frames = sprite.animations[animationName];

            return (
              <Grid
                item
                key={sprite.url + spriteName + animationName}
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                <Card>
                  <Typography gutterBottom variant="h5" component="h2">
                    {spriteName}
                  </Typography>

                  <CardContent className={classes.cardContent}>
                    <Box className={classes.imagePanel}>
                      <Sprite
                        src={sprite.url}
                        frames={frames}
                        width={sprite.frame.width}
                        height={sprite.frame.height}
                        scale={2}
                        time={sprite.frame.time}
                      />
                    </Box>

                    <Box className={classes.dataPanel}>
                      <TextField
                        className={classes.textField}
                        id="Animation"
                        label="Animation"
                        defaultValue={animationName}
                        value={animationName}
                      />
                      <TextField
                        className={classes.textField}
                        id="Width"
                        label="Width"
                        defaultValue={sprite.frame.width}
                        value={sprite.frame.width}
                      />
                      <TextField
                        className={classes.textField}
                        id="Height"
                        label="Height"
                        defaultValue={sprite.frame.height}
                        value={sprite.frame.height}
                      />
                      <TextField
                        className={classes.textField}
                        id="Time"
                        label="Time"
                        defaultValue={sprite.frame.time}
                        value={sprite.frame.time}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          });
        })}
      </Grid>
    </Box>
  );
}
