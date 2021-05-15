import { Store } from "./protocol/types";

import { InMemoryDB } from "./util/in-memory-db";

import { UserData } from "./protocol/types";

import * as env from "./loaders/env";
import * as express from "./loaders/express";
import * as websocket from "./loaders/websocket";

const store: Store = { users: new InMemoryDB<UserData>(), data: {} };

env.load();
express.load(store);
websocket.load(store);
