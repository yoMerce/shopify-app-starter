// @ts-check
import { join } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import loggerPkg from "@s25digital/express-mw-logger";

import applyAuthMiddleware from "./auth";
import { BillingInterval } from "./billing/ensure-billing.js";

import Config from "./config.js";
import { DbMiddleware } from "./db";
import setupGraphQL from "./graphql";
import { cspMiddleware, validateShop, verifyRequest } from "./middleware";
import { setupWebhookRoute } from "./webhooks";
import SessionStorage from "./session";

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

Shopify.Context.initialize({
  API_KEY: Config.SHOPIFY.key,
  API_SECRET_KEY: Config.SHOPIFY.secret,
  SCOPES: Config.SHOPIFY.scopes.split(","),
  HOST_NAME: Config.SHOPIFY.host.replace(/https?:\/\//, ""),
  HOST_SCHEME: Config.SHOPIFY.host.split("://")[0],
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: SessionStorage,
  USER_AGENT_PREFIX: `App Starter`,
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
};

export async function createServer(
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
  app.use(loggerPkg.getLoggerMiddleware({ name: "shopify-app-starter" }));
  app.use(DbMiddleware);

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });
  setupWebhookRoute(app);

  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );

  setupGraphQL(app);

  app.get("/api/products-count", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  setupGraphQL(app);

  app.use(express.json());
  app.use(cspMiddleware);
  app.use(validateShop);

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(Config.PROD_INDEX_PATH));
  }

  app.use("/*", async (req, res, next) => {
    const shop = req.query.shop;
    const { shopInfo } = req;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (shopInfo && shopInfo.isActive === false) {
      res.redirect(`/api/auth?shop=${shop}`);
      return;
    }

    if (shopInfo && shopInfo.shop !== shop) {
      res.redirect(`/api/auth?shop=${shop}`);
      return;
    }

    const fs = await import("fs");
    const fallbackFile = join(
      isProd ? Config.PROD_INDEX_PATH : Config.DEV_INDEX_PATH,
      "index.html"
    );
    res
      .status(200)
      .set("Content-Type", "text/html")
      .send(fs.readFileSync(fallbackFile));
  });

  app.use(loggerPkg.getLogReqMiddleware());
  app.use(loggerPkg.getErrorHandlerMiddleware());

  return { app };
}

export const logger = loggerPkg.Logger;
