import React from "react";

import useUsers, { Users } from "./useUsers";
import useWebSocket, { Packet } from "./useWebSocket";

export interface AppContextType {
  users: Users;
  mainUser: string;
  targetUser: string;
  loggedIn: boolean;
  reconnecting: boolean;
  fn: {
    setMainUser: (name: string) => void;
    setTargetUser: (name: string) => void;
    setLoggedIn: (state: boolean) => void;
    login: (data: { name: string }) => void;
    logout: () => void;
    message: (data: { to: string; text: string }) => void;
  };
}

export const AppContext = React.createContext<AppContextType | {}>({});

export function useNetworkApi() {
  return React.useContext(AppContext) as AppContextType;
}

export interface Props {
  children: React.ReactNode;
}

function App({ children }: Props) {
  const usersHook = useUsers();

  const webSocket = useWebSocket();

  const ref = React.useRef<typeof webSocket | null>();

  const [mainUser, setMainUser] = React.useState("");
  const [targetUser, _setTargetUser] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [packetOnReconnect, setPacketOnReconnect] =
    React.useState<Packet | null>();
  const [reconnecting, setReconnecting] = React.useState(false);

  const setTargetUser = (name: string) => {
    usersHook.setUnreadMessages(name, false);
    _setTargetUser(name);
  };

  const parse = (packet: Packet) => {
    const { packetId, packetData } = packet;

    if (packetId === "login") {
      const { name } = packetData;
      setMainUser(name);
      if (name != null) setLoggedIn(true);
    } else if (packetId === "usersList") {
      const { users } = packetData;
      usersHook.update(users);
    }
  };

  const login = (data: { name: string }) => {
    setPacketOnReconnect({ packetId: "login", packetData: data });
    webSocket.connect({ packetId: "login", packetData: data });
  };

  const logout = () => {
    webSocket.disconnect();
    clear();
    setPacketOnReconnect(null);
  };

  const clear = () => {
    usersHook.clear();

    setMainUser("");
    setTargetUser("");
    setLoggedIn(false);

    // only clear inside logout
    // setPacketOnReconnect(null);
  };

  React.useEffect(() => {
    setReconnecting(!loggedIn && packetOnReconnect != null);
  }, [webSocket.disconnected, packetOnReconnect, loggedIn]);

  React.useEffect(() => {
    if (webSocket.disconnected === true) {
      if (packetOnReconnect) {
        clear();
        webSocket.connect(packetOnReconnect);
      }
    }
  }, [webSocket.disconnected]);

  React.useEffect(() => {
    // Parse all packets
    for (const packet of webSocket.pop()) parse(packet);
  }, [webSocket.messages]);

  React.useEffect(() => {
    const usersNames = Object.keys(usersHook.users);

    if (!usersNames.includes(targetUser)) setTargetUser("");
  }, [usersHook.users]);

  React.useEffect(() => {
    ref.current = webSocket;
  }, [webSocket]);

  React.useEffect(() => {
    // Auto refresh users list
    const intervalId = setInterval(
      () => ref.current && ref.current.send("usersList"),
      1000
    );
    return () => clearInterval(intervalId);
  }, []);

  const contextValue = {
    users: usersHook.users,
    mainUser,
    targetUser,
    loggedIn,
    reconnecting,
    fn: {
      setMainUser,
      setTargetUser,
      setLoggedIn,
      login,
      logout
    }
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export default App;
