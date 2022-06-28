//@ts-check

import { createServer, logger } from "./server.js";
import Config from "./config.js";
import { getDbDriver } from "./db";
import { setupHandlers } from "./webhooks";

async function start() {
  const db = await getDbDriver();

  setupHandlers(db, logger);

  return createServer().then(({ app }) => app.listen(Config.API.port));
}

if (!Config.ISTEST) {
  start();
}
