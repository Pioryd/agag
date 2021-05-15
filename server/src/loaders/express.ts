import path from "path";
import express from "express";
import cors from "cors";

import { Store } from "../protocol/types";

export function load(store: Store) {
  store.app = express();

  store.app.use(express.json());
  store.app.use(express.urlencoded({ extended: true }));
  store.app.use(cors());

  if (process.env.WEB_SERVER === "true") {
    store.app.use(express.static(path.join(__dirname, "../../..", "build")));
    store.app.get("/*", (req, res) =>
      res.sendFile(path.join(__dirname, "../../..", "build", "index.html"))
    );
  }

  store.app.use((req, res, next) => {
    console.log("API not found");
    return res.status(404).send("API not found");
  });
  store.app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message);
  });
}
