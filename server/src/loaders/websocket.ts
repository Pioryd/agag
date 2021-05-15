import WebSocket from "ws";

import { Store, Packet } from "../protocol/types";
import * as parse from "../protocol/parse";
import * as send from "../protocol/send";

export function load(store: Store) {
  store.server = require("http").createServer(store.app);
  store.webSocketServer = new WebSocket.Server({ server: store.server });

  store.server.listen(process.env.PORT, function () {
    console.log(
      `[${process.env.NODE_ENV}]Server is running on port: ${process.env.PORT}`
    );
  });

  // To prevent browser driver connected when tab(page) is closed
  setInterval(() => {
    for (const userData of store.users.find({})) {
      if (!userData.lastPacketTime) {
        if (userData.webSocket) send.logout(userData.webSocket, store);
        continue;
      }

      const seconds = (Date.now() - userData.lastPacketTime) / 1000;

      // User list request is received every 1 second.
      if (seconds > 5) {
        store.users.removeOnce({ id: userData.id });
        if (userData.webSocket) userData.webSocket.close();
        console.log("Timeout.");
      }
    }
  }, 1000);

  store.webSocketServer.on("connection", function (webSocket) {
    try {
      const ipv6 = (<any>webSocket)._socket.address().address;
      console.log("New connection: " + ipv6);

      store.users.create({ webSocket, lastPacketTime: Date.now() });
    } catch (err) {
      console.log(err.message);
    }

    webSocket.on("close", () => {
      try {
        send.logout(webSocket, store);
        console.log("Disconnected.");
      } catch (err) {
        console.log(err.message);
      }
    });

    webSocket.on("message", (data: string) => {
      try {
        const { packetId, packetData } = JSON.parse(data) as Packet;

        if (packetId !== "login" && store.users.findOnce({ webSocket }) == null)
          throw new Error(`Unable to parse. Socket is not belong to any user.`);

        if (packetId in <any>parse) {
          store.users.updateOnce({ webSocket }, { lastPacketTime: Date.now() });
          (<any>parse)[packetId](webSocket, packetData, store);
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  });
}
