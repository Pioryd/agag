import React from "react";
import { createPortal } from "react-three-fiber";
import { v4 as uuidv4 } from "uuid";

import { EventData } from "../core/useEventManager";
import Stats from "../components/Stats";

export type EventInitialize = EventData<"Initialize", string>;
export type EventTerminate = EventData<"Terminate", string>;

interface SceneStore {
  add: (element: React.ReactElement, portalNode?: THREE.Object3D) => () => void;
}

const SceneContext = React.createContext<SceneStore | null>(null);

export function useScene() {
  return React.useContext(SceneContext) as SceneStore;
}

export interface Props {
  children: React.ReactNode;
}

export default function Scene({ children }: Props) {
  const [objects, setObjects] = React.useState<React.ReactElement[]>([]);

  const contextValue: SceneStore = {
    add(newElement, portalNode) {
      const key = newElement.key || uuidv4();
      const instance = portalNode
        ? createPortal(newElement, portalNode, null, key)
        : React.cloneElement(newElement, { key });
      setObjects((current) => [...current, instance as React.ReactElement]);
      return () => {
        setObjects((current) => {
          return current.filter((elem) => elem !== instance);
        });
      };
    }
  };

  React.useEffect(() => {
    contextValue.add(<ambientLight />);
    contextValue.add(<Stats />);
  }, []);

  return (
    <SceneContext.Provider value={contextValue}>
      <group>{objects}</group>
      {children}
    </SceneContext.Provider>
  );
}

// Experimental APIs are NOT included in lib.d.ts
// https://github.com/microsoft/TypeScript/issues/21309
type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};
declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}
