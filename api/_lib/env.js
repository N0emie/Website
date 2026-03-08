const path = require("path");
const dotenv = require("dotenv");

let loaded = false;

function loadEnv() {
  if (loaded) return;
  loaded = true;

  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
  dotenv.config();
}

module.exports = {
  loadEnv
};
