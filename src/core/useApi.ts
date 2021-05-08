import React from "react";

export interface Api<T1 = string, T2 = any> {
  name: Readonly<T1>;
  api: Readonly<T2>;
}

export type ValueType = ReturnType<typeof useApi>;

export default function useApi() {
  const [registry] = React.useState(() => new Map<string, any>());

  const add = <T extends Api>(name: T["name"], api: T["api"]) => {
    registry.set(name, api);
    return () => remove<T>(name);
  };
  const remove = <T extends Api>(name: T["name"]) => {
    registry.delete(name);
  };
  const get = <T extends Api>(name: T["name"]): T["api"] => {
    return registry.get(name);
  };

  return { add, remove, get };
}
