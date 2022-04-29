import app, { logger } from "./app";
import Config from "./config";
import { getDbDriver } from "./db";
import { setupHandlers } from "./webhooks";

async function start() {
  const db = await getDbDriver();

  setupHandlers(db, logger);

  app.listen(Config.API.port, () => {
    logger.info(`Running on ${Config.API.port}`);
  });
}

start();
