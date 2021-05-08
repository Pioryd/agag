export type Index = number | string;
export type Area = Index[][];
export interface MapData {
  floor: Area;
  objects: Area;
}
export type Objects = { [key: string]: object };

export interface Props {
  map: { tiles: MapData; objects: Objects };
}

export default function Map({ map }: Props) {
  return (
    <>
      {Object.values(map.tiles).map((tileType: Area, i) =>
        tileType.map((row, y) =>
          row.map((type, x) => map.objects[type] && <div />)
        )
      )}
    </>
  );
}
