const path = require("path");
const dotenv = require("dotenv");

export function load() {
  dotenv.config();
  dotenv.config({ path: path.join(`.env.${process.env.NODE_ENV}`) });
}
