import React from "react";

export interface Packet {
  packetId: string;
  packetData: { [key: string]: any };
}

export default function useWebSocket() {
  const [__debugReconnect, __setDebugReconnect] = React.useState(false);

  const [webSocket, setWebSocket] = React.useState<WebSocket>();
  const [messages, setMessages] = React.useState<Packet[]>([]);

  const [disconnected, setDisconnected] = React.useState(true);

  const pop = () => {
    if (messages.length === 0) return [];
    const returnMessages = [...messages];
    setMessages([]);
    return returnMessages;
  };

  const send = (packetId: string, packetData: any = {}) => {
    try {
      if (!__debugReconnect) {
        webSocket &&
          webSocket.readyState === WebSocket.OPEN &&
          webSocket.send(JSON.stringify({ packetId, packetData }));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const connect = (packetOnConnected: Packet | undefined) => {
    if (packetOnConnected == null) return;

    const newWebSocket = new WebSocket(String(process.env.REACT_APP_WS_URL));
    if (newWebSocket == null) return;

    newWebSocket.onopen = () => {
      console.log("Connected");

      // state webSocket will be set after event "onopen"
      newWebSocket.send(JSON.stringify(packetOnConnected));
    };
    newWebSocket.onmessage = (ev) =>
      setMessages([...messages, JSON.parse(ev.data)]);
    newWebSocket.onclose = () => {
      console.log("Disconnected");
      console.log("Reconnecting...");
      setDisconnected(true);
    };

    setDisconnected(false);
    setWebSocket(newWebSocket);
  };

  const disconnect = () => {
    if (webSocket) {
      webSocket.onopen = null;
      webSocket.onmessage = null;
      webSocket.onclose = null;
      webSocket.close();
    }
    setWebSocket(undefined);
  };

  React.useEffect(() => () => disconnect(), []);

  return {
    messages,
    disconnected,
    send,
    pop,
    connect,
    disconnect,
    __setDebugReconnect
  };
}
