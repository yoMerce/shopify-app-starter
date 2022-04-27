import app, { logger } from "./app";
import Config from "./config";
import { getDbDriver } from "./db";

async function start() {
  await getDbDriver();
  app.listen(Config.API.port, () => {
    logger.info(`Running on ${Config.API.port}`);
  });
}

start();
