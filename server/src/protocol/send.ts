import WebSocket from "ws";

import { Store } from "./types";
import { send } from "./util";

// Optional args order:
//  webSocket -> data -> store

export function logout(webSocket: WebSocket, store: Store) {
  store.users.removeOnce({ webSocket });

  usersListToEveryOne(store);
}

export function login(
  webSocket: WebSocket,
  data: { name?: string },
  store: Store
) {
  send(webSocket, "login", data);
}

export function usersList(webSocket: WebSocket, store: Store) {
  const usersData = store.users.find({});
  const usersList: string[] = [];

  for (const userData of usersData)
    if (userData.name && userData.webSocket != webSocket)
      usersList.push(userData.name);

  send(webSocket, "usersList", { users: usersList });
}

export function usersListToEveryOne(store: Store) {
  const usersData = store.users.find({});

  for (const userData of usersData) {
    if (
      !userData ||
      !userData.name ||
      !userData.webSocket ||
      userData.webSocket.readyState !== WebSocket.OPEN
    )
      continue;

    usersList(userData.webSocket, store);
  }
}
