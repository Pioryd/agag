import React from "react";

import data from "../../../__mockData/data";

interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
}

interface AudioInfo {
  url: string;
  duration?: string;
}

export default function Assets() {
  const [imageInfoUrls, setImageInfoUrls] = React.useState<{
    [key: string]: ImageInfo;
  }>({});
  const [audioInfoUrls, setAudioInfoUrls] = React.useState<{
    [key: string]: AudioInfo;
  }>({});

  React.useEffect(() => {
    const uniqueImageUrls = new Set<string>();
    const uniqueAudioUrls = new Set<string>();
    const imagePattern = `^.*\\.(jpg|png|gif)$`;
    const audioPattern = `^.*\\.(wav|mp3|ogg)$`;

    function get(obj: object) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object") get(value);
        else if (key === "url") {
          if (value.match(imagePattern)) {
            uniqueImageUrls.add(value);
          } else if (value.match(audioPattern)) {
            uniqueAudioUrls.add(value);
          } else {
            console.error("wrong link");
          }
        }
      }
    }
    get(data);

    for (const url of uniqueImageUrls) {
      imageInfoUrls[url] = { url };
      const image = new Image();
      image.onload = function () {
        imageInfoUrls[url].width = image.width;
        imageInfoUrls[url].height = image.height;
        setImageInfoUrls({ ...imageInfoUrls });
      };
      image.src = url;
    }
    for (const url of uniqueAudioUrls) {
      audioInfoUrls[url] = { url };
      const audio = new Audio();
      audio.oncanplaythrough = function () {
        audioInfoUrls[url].duration = audio.duration.toPrecision(2);
        setAudioInfoUrls({ ...audioInfoUrls });
      };
      audio.src = url;
    }

    setImageInfoUrls({ ...imageInfoUrls });
    setAudioInfoUrls({ ...audioInfoUrls });
  }, []);

  return {
    imageInfoUrls,
    audioInfoUrls
  };
}
