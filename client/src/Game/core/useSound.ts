import React from "react";
import { useAsset, SoundAsset } from "../managers/Asset";

export type Props = Partial<SoundAsset> | null;

export function useSound(props: Props) {
  const assets = useAsset();
  const audio = props?.url
    ? (assets.assets[props.url] as HTMLAudioElement)
    : null;

  const play = React.useCallback(
    (url: string | null) => {
      if (url) {
        const customAudio = assets.assets[url] as HTMLAudioElement;
        customAudio.currentTime = 0;
        customAudio.loop = false;
        customAudio.volume = props?.volume || 1;
        customAudio.play().catch(() => {});
      } else if (audio) {
        audio.currentTime = 0;
        audio.loop = false;
        audio.volume = props?.volume || 1;
        audio.play().catch(() => {});
      }
    },
    [audio]
  );

  return { play };
}
