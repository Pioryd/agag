import _ from "lodash";

import { useAsset, SpriteAsset } from "../managers/Asset";

import { Position } from "./types";

import Sprite, { SpriteProps } from "./Sprite";

export interface SelectedSpriteAsset extends SpriteProps {
  name: string;
  animation: string;
  offset?: Position;
}
export interface Props {
  collidable?: boolean;
  moveable?: boolean;
  interactable?: boolean;
  player?: boolean;
  character?: boolean;
  script?: any;
  selectedSoundAsset?: string;
  selectedSpriteAsset?: SelectedSpriteAsset;
}

export default function Entity(props: Props) {
  const assets = useAsset();

  return (
    <div>
      {assets && props?.selectedSpriteAsset && (
        <Sprite
          asset={{
            // @ts-ignore
            ...(_.get(
              assets.data.sprite,
              props.selectedSpriteAsset.name
            ) as SpriteAsset),
            ...props.selectedSpriteAsset
          }}
        />
      )}

      {props.collidable && <div />}
      {props.moveable && <div />}
      {props.interactable && <div />}

      {props.script && <div />}

      {(props.character || props.player) && <div />}
      {props.player && <div />}
    </div>
  );
}
