import _ from "lodash";

import GameObject, { GameObjectProps } from "../managers/GameObject";
import { useAsset, SpriteAsset } from "../managers/Asset";

import { Position } from "../core/types";

import CharacterScript from "../behaviors/Character";
import Controller from "../behaviors/Controller";

import Collidable from "../behaviors/Collidable";
import Interactable from "../behaviors/Interactable";
import Moveable from "../behaviors/Moveable";
import Scriptable from "../behaviors/Scriptable";
import Camera from "../behaviors/Camera";

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
  camera?: boolean;
  controller?: boolean;
  character?: boolean;
  script?: any;
  selectedSoundAsset?: string;
  selectedSpriteAsset?: SelectedSpriteAsset;
  gameObject: GameObjectProps;
}

export default function Entity(props: Props) {
  const assets = useAsset();

  return (
    <GameObject {...props.gameObject}>
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

      {props.collidable && <Collidable />}
      {props.moveable && <Moveable />}
      {props.interactable && <Interactable />}

      {props.script && (
        <Scriptable
          sound={
            props.selectedSoundAsset &&
            assets.data.sound[props.selectedSoundAsset]
          }
          {...props.script}
        />
      )}

      {props.camera && <Camera />}
      {(props.character || props.controller) && <CharacterScript />}
      {props.controller && <Controller />}
    </GameObject>
  );
}
