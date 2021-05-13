import { Grid, Card, CardContent, Box, Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import useAssets from "./useAssets";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f3f3f3",
      flexGrow: 1,
      padding: theme.spacing(3)
    },

    image: {
      maxWidth: "100%",
      height: "auto"
    }
  })
);

export default function Assets() {
  const classes = useStyles();

  const { imageInfoUrls, audioInfoUrls } = useAssets();

  return (
    <Box className={classes.root}>
      <Grid container spacing={3}>
        {Object.values(imageInfoUrls).map((info) => (
          <Grid item xs={12} key={info.url}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {info.url}
                </Typography>
                <Typography gutterBottom variant="h6" component="h2">
                  {info.width}x{info.height}
                </Typography>
                <img className={classes.image} src={info.url} alt={info.url} />
              </CardContent>
            </Card>
          </Grid>
        ))}
        {Object.values(audioInfoUrls).map((info) => (
          <Grid item xs={12} key={info.url}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {info.url}
                </Typography>
                <Typography gutterBottom variant="h4" component="h2">
                  duration: {info.duration}
                </Typography>
                <audio controls>
                  <source src={info.url} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
