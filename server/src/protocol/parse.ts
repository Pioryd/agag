import WebSocket from "ws";

import validate from "../util/validate";

import * as send from "./send";
import { Store } from "./types";

export function login(webSocket: WebSocket, data: any, store: Store) {
  try {
    const { name } = data;

    validate({ name });

    if (store.users.findOnce({ name }) != null) {
      send.login(webSocket, {}, store);
      return;
    }

    store.users.updateOnce({ webSocket }, { name: data.name });

    send.login(webSocket, { name }, store);
    send.usersListToEveryOne(store);
  } catch (err) {
    console.log(err.message);
  }
}

export function usersList(webSocket: WebSocket, data: any, store: Store) {
  try {
    send.usersList(webSocket, store);
  } catch (err) {
    console.log(err.message);
  }
}
