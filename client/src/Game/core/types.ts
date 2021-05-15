export interface Position {
  x: number;
  y: number;
}

export enum Layer {
  floor = 1,
  item = 2,
  character = 3
}

export enum Tiles {
  walkable = 1,
  collidable = 2
}
