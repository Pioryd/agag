import React from "react";

export interface EventData<T1 = string, T2 = any> {
  name: Readonly<T1>;
  callbackData: T2;
}
export type Callback<T = any> = (callbackData: T) => void | Promise<any>;
export type ValueType = ReturnType<typeof useEventManager>;

type Events = { [name: string]: Callback[] };

export default function useEventManager() {
  const events = React.useRef<Events>({});

  const emit = async <T extends EventData>(
    name: T["name"],
    callbackData?: T["callbackData"]
  ) => {
    const listeners = events.current[name];
    if (listeners == null) return false;

    await Promise.all(
      listeners.slice().map((listener) => listener(callbackData))
    );
    return true;
  };

  const remove = <T extends EventData>(
    name: T["name"],
    listener: Callback<T["callbackData"]>
  ) => {
    const listeners = events.current[name];
    if (listeners == null) return;

    listeners.splice(listeners.indexOf(listener), 1);
  };

  const add = <T extends EventData>(
    name: T["name"],
    listener: Callback<T["callbackData"]>
  ) => {
    if (events.current[name] == null) events.current[name] = [];
    events.current[name].push(listener);

    return () => remove(name, listener);
  };

  const contains = <T extends EventData>(name: T["name"]) => {
    const listeners = events.current[name];

    return listeners == null ? 0 : listeners.length;
  };

  return {
    emit,
    add,
    remove,
    contains
  };
}
