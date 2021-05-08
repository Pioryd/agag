import React from "react";
import { useUpdate, useFrame } from "react-three-fiber";
import * as THREE from "three";

import { useGameObject } from "../managers/GameObject";
import { useAsset, SpriteAsset } from "../managers/Asset";

import { Position } from "./types";

export interface Props {
  asset?: SpriteAsset;
  flipX?: number;
  offset?: Position;
  magFilter?: THREE.TextureFilter;
}

const geometry = new THREE.PlaneBufferGeometry(1, 1);

export default React.memo(
  React.forwardRef<THREE.Object3D, Props>(function Graphic(
    {
      asset,
      flipX = 1,
      offset = { x: 0, y: 0 },
      magFilter = THREE.NearestFilter
    }: Props,
    meshRef
  ) {
    if (!asset || !asset.animation || !asset.animations?.[asset.animation])
      console.error(`Wrong asset data.\n'` + JSON.stringify(asset, null, 2));

    const { draw } = useGameObject();
    const assets = useAsset();
    const textureRef = useUpdate<THREE.Texture>((texture) => {
      texture.needsUpdate = true;
    }, []);

    const image = asset?.url && (assets.assets[asset.url] as HTMLImageElement);

    const updateTextureOffset = React.useCallback(() => {
      if (!image) {
        console.error(`Image does not exist from url:[${asset?.url}].`);
        return;
      }
      if (!asset?.frame) {
        console.error(`No found frame settings`);
        return;
      }

      const frames = asset.animations?.[asset.animation || 0] || [];

      const textureOffsetX = (frames[0][0] * asset.frame.width) / image.width;
      const textureOffsetY = (frames[0][1] * asset.frame.height) / image.height;

      textureRef.current?.offset.set(textureOffsetX, textureOffsetY);
    }, [asset, image, textureRef]);

    React.useEffect(() => updateTextureOffset(), [updateTextureOffset]);

    useFrame(() => {
      if (!draw) return;

      updateTextureOffset();
    });

    const textureProps = React.useMemo<Partial<THREE.Texture>>(() => {
      let size = { x: 0, y: 0 };

      if (!asset?.frame) {
        console.error(`No frame settings`);
      } else if (!image) {
        console.error(`Image does not exist url:[${asset.url}].`);
      } else {
        size = {
          x: image.width / asset.frame.width,
          y: image.height / asset.frame.height
        };
      }

      return {
        image,
        repeat: new THREE.Vector2(1 / size.x, 1 / size.y),
        magFilter
      };
    }, [asset, asset?.frame, image, magFilter]);

    if (!image) {
      console.error(`Image does not exist url:[${asset?.url}].`);
      return null;
    }

    return (
      <mesh
        ref={meshRef}
        position={[offset.x, offset.y, 1]}
        scale={[flipX, 1, 1]}
        geometry={geometry}
      >
        <meshLambertMaterial attach="material" transparent={true}>
          <texture
            ref={textureRef}
            attach="map"
            {...textureProps}
            encoding={THREE.sRGBEncoding}
          />
        </meshLambertMaterial>
      </mesh>
    );
  })
);
