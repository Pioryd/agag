import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { AccountCircle as AccountCircleIcon } from "@material-ui/icons";

import { useNetworkApi } from "../../managers/NetworkApi";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f3f3f3",
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    },
    list: {
      maxWidth: "400px"
    }
  })
);

export default function Assets() {
  const classes = useStyles();

  const { users } = useNetworkApi();

  return (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Users online
                </Typography>

                <List className={classes.list}>
                  {users.map((name, index) => (
                    <>
                      <ListItem key={name + "_" + index}>
                        <ListItemIcon>
                          <AccountCircleIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText primary={name} secondary="user" />
                      </ListItem>
                      <Divider />
                    </>
                  ))}
                </List>
              </CardContent>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
