import React from "react";
import _ from "lodash";
import {
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import Sprite from "../../components/Sprite";

import data from "../../../__mockData/data";
import objects from "../../../__mockData/objects";
import { SpriteAsset } from "../../../Game/managers/Asset";

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
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  })
);

export default function Sprites() {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<any>({});

  const onSelect = (objectName: string) => {
    const object = objects[objectName];
    // @ts-ignore
    const sprite: any = _.get(
      data.sprite,
      object?.selectedSpriteAsset?.name || ""
    );
    const frames = Object.values(sprite.animations)[0] as number[][];
  };

  return (
    <Box className={classes.root}>
      {/* <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
        <Select
          native
          value={state.age}
          onChange={(e) => onSelect(e.target.value)}
          label="Age"
          inputProps={{
            name: "age",
            id: "outlined-age-native-simple"
          }}
        >
          <option aria-label="None" value="" />
          {Object.keys(objects).map((objectName: string) => 
             (
              <option key={objectName} value={objectName}>
                objectName
              </option>
            );
          )}
        </Select>
      </FormControl>

      <Card>
        <Typography gutterBottom variant="h5" component="h2">
          {objectName}
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
      </Card> */}
    </Box>
  );
}
