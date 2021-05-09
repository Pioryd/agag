import React from "react";
import EasyStar from "easystarjs";

import { useGameObject } from "../managers/GameObject";
import { useGame } from "../managers/Game";

import { InteractableApi } from "../behaviors/Interactable";

import { Position, Tiles } from "./types";

export default function usePath() {
  const {
    mapSize,
    isPositionWalkable,
    getGameObjectsApisByPosition
  } = useGame();
  const { position } = useGameObject();
  const [easystar] = React.useState(() => new EasyStar.js());

  const createGrid = React.useCallback(
    (destination?: Position) => {
      const [width, height] = mapSize;
      const grid: number[][] = [[]];

      for (let y = 0; y < height; y++) {
        grid[y] = grid[y] || [];

        for (let x = 0; x < width; x++) {
          grid[y][x] = isPositionWalkable({ x, y })
            ? Tiles.walkable
            : Tiles.collidable;

          if (
            destination != null &&
            x === destination.x &&
            y === destination.y &&
            getGameObjectsApisByPosition({ x, y }).some(
              (api) =>
                api.apiManager.get<InteractableApi>("Interactable") != null
            )
          )
            grid[y][x] = Tiles.walkable;
        }
      }
      return grid;
    },
    [isPositionWalkable, getGameObjectsApisByPosition, mapSize]
  );

  const findPath = React.useCallback(
    ({ from = position, to }: { from?: Position; to: Position }) => {
      let result: { x: number; y: number }[] = [];

      try {
        easystar.setGrid(createGrid(to));
        easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
          if (path) result = path.slice(1);
        });
        easystar.calculate();
      } catch {}
      return result;
    },
    [createGrid, position]
  );

  React.useEffect(() => {
    if (!easystar) return;

    easystar.setAcceptableTiles([Tiles.walkable]);
    easystar.disableCornerCutting();
    easystar.enableDiagonals();
    easystar.enableSync();
  }, [easystar]);

  return { findPath };
}
