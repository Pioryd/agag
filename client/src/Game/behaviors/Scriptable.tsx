import React from "react";
import _ from "lodash";

import { useGame } from "../managers/Game";
import { useGameObject } from "../managers/GameObject";
import * as utils from "../utils";

import { Props as PropsOfSound, useSound } from "../core/useSound";

import { EventOnInteraction } from "./Interactable";
import { EventCollisionBegin, EventCollisionEnd } from "./Collidable";
import {
  EventMoveBegin,
  EventMoveActive,
  EventMoveEnd,
  EventMoveUpdate
} from "./Moveable";

const events: Array<
  | EventOnInteraction["name"]
  //
  | EventCollisionBegin["name"]
  | EventCollisionEnd["name"]
  //
  | EventMoveBegin["name"]
  | EventMoveActive["name"]
  | EventMoveEnd["name"]
  | EventMoveUpdate["name"]
> = [
  "OnInteraction",
  //
  "CollisionBegin",
  "CollisionEnd",
  //
  "MoveBegin",
  "MoveActive",
  "MoveEnd",
  "MoveUpdate"
];

function sourceToFunction(script: Script) {
  // !! After edit args, edit too in function [execute]
  eval(`script.fn = async function({
    gameContext,
    gameObjectApi,
    utils,
    store,
    sound,
    data
  }) {${script.source};   }`);
}
interface Script {
  name: string;
  source: string;
  fn?: any;
}
export interface Props {
  store: any;
  fn: { OnInteraction?: Script[]; CollisionBegin?: Script[] };
  sound: PropsOfSound;
}

export default function Scriptable(props: Props) {
  const gameContext = useGame();
  const gameObjectApi = useGameObject();
  const sound = useSound(props.sound);
  const store = React.useRef(_.cloneDeep(props.store));

  const execute = React.useCallback(
    (script?: Script, data: any = {}) => {
      try {
        if (!script?.fn) return;

        // !! After edit args, edit too in function [sourceToFunction]
        script.fn({
          gameContext,
          gameObjectApi,
          utils,
          store: store.current,
          sound,
          data
        });
      } catch (err) {
        console.error(`Unable to execute script [${script?.name}]`, err);
      }
    },
    [gameContext, gameObjectApi, utils, store, sound]
  );

  React.useEffect(() => {
    const { add } = gameObjectApi.eventManager;
    const { fn } = props as any;
    const removeCallbacks: any = [];

    for (const event of events) {
      if (!fn[event]) continue;

      for (const script of fn[event]) {
        sourceToFunction(script);
        removeCallbacks.push(add(event, (data) => execute(script, data)));
      }
    }

    return () => {
      for (const removeCallback of removeCallbacks) removeCallback();
    };
  }, []);

  return null;
}
