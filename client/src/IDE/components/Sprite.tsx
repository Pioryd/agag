import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

interface Size {
  width: number;
  height: number;
}

interface Props {
  src: string;
  width: number;
  height: number;
  scale: number;
  time: number;
  frames: number[][];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: (props: any) => props.width * props.scale,
      height: (props: any) => props.height * props.scale
    },
    container: {
      width: (props: any) => props.width,
      height: (props: any) => props.height,
      overflow: "hidden",
      transform: (props: any) => `scale(${props.scale}, ${props.scale})`,
      transformOrigin: "top left"
    },
    image: {
      transform: (props: any) => {
        return `translate(-${props.left}px, -${
          props.imageSize.height - props.height - props.top
        }px)`;
      }
    }
  })
);

export default function Sprite({
  src,
  width,
  height,
  scale,
  time,
  frames
}: Props) {
  const [left, setLeft] = React.useState<number>(0);
  const [top, setTop] = React.useState<number>(0);
  const [size, setSize] = React.useState<Size | null>(null);

  const classes = useStyles({
    imageSize: size || { width: 0, height: 0 },
    width,
    height,
    left,
    top,
    scale
  });

  const [currentFrame, setCurrentFrame] = React.useState(0);

  const animateDataRef = React.useRef({
    currentFrame,
    time: 0,
    request: 0
  });

  React.useEffect(
    () => setLeft(width * frames[currentFrame][0]),
    [width, currentFrame, frames]
  );
  React.useEffect(
    () => setTop(height * frames[currentFrame][1]),
    [height, currentFrame, frames]
  );

  React.useEffect(() => {
    const animate = async () => {
      if (Date.now() - animateDataRef.current.time >= time) {
        animateDataRef.current.time = Date.now();

        animateDataRef.current.currentFrame++;
        if (animateDataRef.current.currentFrame >= frames.length)
          animateDataRef.current.currentFrame = 0;
        setCurrentFrame(animateDataRef.current.currentFrame);
      }

      animateDataRef.current.request = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animateDataRef.current.request);
    };
  }, [setCurrentFrame]);

  React.useEffect(() => {
    animateDataRef.current.currentFrame = currentFrame;
  }, [currentFrame]);

  React.useEffect(() => {
    const image = new Image();
    image.onload = function () {
      setSize({ width: image.width, height: image.height });
    };
    image.src = src;
  }, []);

  if (size == null) return null;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <img className={classes.image} src={src} />
      </div>
    </div>
  );
}
