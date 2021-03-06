import React from "react";
import * as THREE from "three";

import { useGameObject } from "../managers/GameObject";
import { Api } from "../core/useApi";

import Graphic, { Props as GraphicProps } from "./Graphic";
import { Position } from "./types";

export type ApiSprite = Api<
  "Sprite",
  {
    setAnimation: React.Dispatch<React.SetStateAction<string>>;
    setFlipX: React.Dispatch<React.SetStateAction<number | undefined>>;
    setOffset: React.Dispatch<React.SetStateAction<Position | undefined>>;
    flipX: number | undefined;
    ref: React.RefObject<THREE.Object3D> | null | undefined;
  }
>;

export type SpriteProps = GraphicProps;

export default function Sprite({
  asset,
  flipX: initialFlipX,
  offset: initialOffset,
  ...graphicProps
}: SpriteProps) {
  const { apiManager } = useGameObject();

  const [flipX, setFlipX] = React.useState(initialFlipX);
  const [animation, setAnimation] = React.useState(asset?.animation || "");
  const [offset, setOffset] = React.useState(initialOffset);
  const ref = React.useRef<THREE.Object3D>(null);

  React.useLayoutEffect(() => {
    return apiManager.add<ApiSprite>("Sprite", {
      setAnimation,
      setOffset,
      setFlipX,
      flipX,
      ref
    });
  }, []);

  return (
    <Graphic
      ref={ref}
      asset={
        asset
          ? { ...asset, animation }
          : { animation, frame: { width: 16, height: 16 } }
      }
      flipX={flipX}
      offset={offset}
      {...graphicProps}
    />
  );
}
