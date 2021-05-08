import React from "react";

import { useGame } from "../managers/Game";

import Entity, { Props as EntityProps } from "./Entity";

export type Index = number | string;
export type Area = Index[][];
export interface MapData {
  floor: Area;
  objects: Area;
}
export type Objects = { [key: string]: EntityProps };

export interface Props {
  map: { tiles: MapData; objects: Objects };
}

export default function Map({ map }: Props) {
  const { setMapSize } = useGame();

  React.useEffect(
    () => setMapSize([map.tiles.floor[0].length, map.tiles.floor.length]),
    [map]
  );

  return (
    <>
      {Object.values(map.tiles).map((tileType: Area, i) =>
        tileType.map((row, y) =>
          row.map(
            (type, x) =>
              map.objects[type] && (
                <Entity
                  key={`${x}-${y}-${i}`}
                  {...map.objects[type]}
                  gameObject={{
                    ...map.objects[type].gameObject,
                    position: { x, y }
                  }}
                />
              )
          )
        )
      )}
    </>
  );
}
