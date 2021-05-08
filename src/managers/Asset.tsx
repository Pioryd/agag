import React from "react";
import { Html } from "@react-three/drei";

const assets: AssetStore = {
  assets: {},
  data: { sprite: {}, sound: {} }
};
const AssetManagerContext = React.createContext<AssetStore>(assets);

export type AssetType = HTMLImageElement | HTMLAudioElement;

export interface SoundAsset {
  url: string;
  volume?: number;
}
export interface SpriteAsset {
  url?: string;
  animations?: {
    [index: string]: number[][];
  };
  animation?: string;
  frame: {
    width: number;
    height: number;
  };
}
export interface AssetsData {
  sprite: { [index: string]: { [index: string]: SpriteAsset } };
  sound: { [index: string]: SoundAsset };
}

export interface AssetStore {
  assets: { [url: string]: AssetType };
  data: AssetsData;
}

export function useAsset() {
  return React.useContext(AssetManagerContext) as AssetStore;
}

export interface Props {
  data: AssetsData;
  children?: React.ReactNode;
}

export default function AssetManager({ data: initialData, children }: Props) {
  const [data, setData] = React.useState(initialData);
  const [attempts, setAttempts] = React.useState(0);

  const apiRef = React.useRef({ attempts, setAttempts });
  const mounted = React.useRef(true);
  const timeout = React.useRef<NodeJS.Timeout>();
  const loadedAssets = React.useRef(false);

  const loadAsset = React.useCallback((url: string) => {
    return new Promise<AssetType>((resolve, reject) => {
      const imagePattern = `^.*\\.(jpg|png|gif)$`;
      const audioPattern = `^.*\\.(wav|mp3|ogg)$`;

      let asset: AssetType;

      function onLoad(event: Event) {
        if (event.type === "error") {
          reject();
          return;
        }
        resolve(asset);
      }

      if (url.match(imagePattern)) {
        asset = new Image();
        asset.onload = onLoad;
      } else if (url.match(audioPattern)) {
        asset = new Audio();
        asset.oncanplaythrough = onLoad;
      } else return;

      asset.onerror = () => reject();
      asset.src = url;
    });
  }, []);

  React.useEffect(() => {
    apiRef.current = {
      attempts,
      setAttempts
    };
  }, [attempts, setAttempts]);

  React.useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  React.useEffect(() => {
    assets.data = data;
  }, [data]);

  React.useEffect(() => {
    async function loadAssets() {
      const uniqueUrls: Set<string> = new Set();
      for (const spriteTypesValues of Object.values(data.sprite)) {
        for (const sprite of Object.values(spriteTypesValues))
          sprite.url && uniqueUrls.add(sprite.url);
      }
      for (const sound of Object.values(data.sound)) {
        uniqueUrls.add(sound.url);
      }

      let count = 0;

      for (const url of uniqueUrls) {
        try {
          const asset = await loadAsset(url);
          assets.assets[url] = asset;
          if (mounted.current) count++;
        } catch {
          console.error("Unable to load asset:", url);
        }
      }

      if (count === uniqueUrls.size) {
        loadedAssets.current = true;
        timeout.current && clearTimeout(timeout.current);
        setData({ ...data }); // force re-rendering
        return;
      }

      console.error(
        "Failed to load assets. Trying again... Attempt: " +
          apiRef.current.attempts
      );

      timeout.current = setTimeout(() => {
        apiRef.current.setAttempts(apiRef.current.attempts + 1);
        loadAssets();
      }, 2000);
      return () => timeout.current && clearTimeout(timeout.current);
    }

    loadAssets();
  }, []);

  if (!loadedAssets.current) {
    return (
      <Html style={{ whiteSpace: "nowrap", pointerEvents: "none" }}>
        <span>Loading assets...</span>
        {attempts > 0 && (
          <span>
            Warning: Unable to load assets. Trying again. Attempt: {attempts}
          </span>
        )}
      </Html>
    );
  }

  return (
    <AssetManagerContext.Provider value={assets}>
      {children}
    </AssetManagerContext.Provider>
  );
}
