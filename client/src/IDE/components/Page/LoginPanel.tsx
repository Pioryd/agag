import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, TextField, Button, Typography, Box } from "@material-ui/core";

import { useNetworkApi } from "../../managers/NetworkApi";

import validate from "../../../util/validate";

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
    mainGrid: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      justifyItems: "center"
    },
    title: {
      marginBottom: 50
    },
    button: {
      marginTop: 25
    }
  })
);

export default function LoginPanel() {
  const classes = useStyles();
  const { fn } = useNetworkApi();

  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");

  const onUpdateName = (name: string) => {
    setName(name);
    setError("");
  };

  const login = () => {
    try {
      validate({ name });

      fn.login({ name });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box className={classes.root}>
      <Grid container className={classes.mainGrid}>
        <Grid item xs={12}>
          <Typography className={classes.title} variant="h3" component="h2">
            Login
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            variant="outlined"
            error={error !== ""}
            helperText={error}
            label="Name"
            value={name}
            onChange={(e) => onUpdateName(e.target.value)}
          />
          <Button
            className={classes.button}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => login()}
          >
            Enter
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
