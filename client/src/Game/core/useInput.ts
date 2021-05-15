import React from "react";
import { v4 as uuidv4 } from "uuid";

export type InputKeys = Readonly<string[]>;
export type Callback = (e: KeyboardEvent) => void;
export type Listeners = {
  [key: string]: { isPressed: boolean; callback?: Callback };
};

export type Event = {
  keys: string[];
  callback?: Callback;
};

export interface Listener extends Event {
  pressed: boolean;
}

export default function useInput() {
  const [listeners, setListeners] = React.useState<{ [key: string]: Listener }>(
    {}
  );

  const api = React.useMemo(
    () => ({
      createEvent(event: Event) {
        const id = uuidv4();
        listeners[id] = { ...event, pressed: false };

        setListeners({ ...listeners });
        return id;
      },
      removeEvent(id: string) {
        delete listeners[id];
        setListeners({ ...listeners });
      },
      isPressed(id: string) {
        return listeners[id].pressed;
      }
    }),
    [listeners]
  );

  const eventsListeners = React.useMemo(
    () => ({
      onKeyDown(event: KeyboardEvent) {
        for (const value of Object.values(listeners)) {
          if (value.keys.includes(event.key)) {
            value.pressed = true;
            value.callback?.(event);
          }
        }
        setListeners({ ...listeners });
      },
      onKeyUp(event: KeyboardEvent) {
        for (const value of Object.values(listeners))
          if (value.keys.includes(event.key)) value.pressed = false;
        setListeners({ ...listeners });
      },
      onBlur() {
        for (const value of Object.values(listeners)) value.pressed = false;

        setListeners({ ...listeners });
      }
    }),
    [listeners]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", eventsListeners.onKeyDown);
    window.addEventListener("keyup", eventsListeners.onKeyUp);
    window.addEventListener("blur", eventsListeners.onBlur);

    return () => {
      window.removeEventListener("keydown", eventsListeners.onKeyDown);
      window.removeEventListener("keyup", eventsListeners.onKeyUp);
      window.removeEventListener("blur", eventsListeners.onBlur);
    };
  }, [eventsListeners]);

  return api;
}
