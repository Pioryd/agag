import WebSocket from "ws";
import { Express } from "express";
import { InMemoryDB } from "../util/in-memory-db";

export interface Store {
  app?: Express;
  server?: any;
  webSocketServer?: WebSocket.Server;
  users: InMemoryDB<UserData>;
  data: any;
}

export interface Packet {
  packetId: string;
  packetData: any;
}

export interface UserData {
  id?: string;
  webSocket?: WebSocket;
  name?: string;
  lastPacketTime?: number;
}
