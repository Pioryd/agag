import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Button, Box, CircularProgress, Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import { useNetworkApi } from "../../managers/NetworkApi";

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
    button: {
      marginTop: 10
    },
    circularProgressBox: {
      marginTop: 10,
      width: "100%"
    }
  })
);

export default function ConnectingPanel() {
  const classes = useStyles();

  const { fn, mainUser } = useNetworkApi();

  const cancel = () => fn.logout();

  return (
    <Box className={classes.root}>
      <Grid container className={classes.mainGrid}>
        <Grid item xs={12}>
          {mainUser != null ? (
            <>
              <Alert severity="info">Connecting...</Alert>
              <Box className={classes.circularProgressBox}>
                <CircularProgress />
              </Box>

              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={cancel}
              >
                cancel
              </Button>
            </>
          ) : (
            <>
              <Alert severity="error">
                User with this name is already logged in.
              </Alert>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={cancel}
              >
                back
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
