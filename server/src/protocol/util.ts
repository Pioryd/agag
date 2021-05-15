import WebSocket from "ws";

export function send(
  webSocket: WebSocket | undefined,
  packetId: string,
  packetData: any
) {
  if (webSocket && webSocket.readyState === WebSocket.OPEN)
    webSocket.send(JSON.stringify({ packetId, packetData }));
}
