import { ApiVersion, Shopify } from "@shopify/shopify-api";
import app, { logger } from "./app";
import Config from "./config";
import { getDbDriver } from "./db";
import SessionStorage from "./session";
import { setupHandlers } from "./webhooks";

async function start() {
  const db = await getDbDriver();

  // Initialize shopify context
  Shopify.Context.initialize({
    API_KEY: process.env.SHOPIFY_API_KEY,
    API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
    SCOPES: (process.env.SHOPIFY_API_SCOPES || "").split(","),
    HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
    API_VERSION: ApiVersion.April22,
    IS_EMBEDDED_APP: true,
    SESSION_STORAGE: SessionStorage,
  });

  setupHandlers(db, logger);

  app.listen(Config.API.port, () => {
    logger.info(`Running on ${Config.API.port}`);
  });
}

start();
