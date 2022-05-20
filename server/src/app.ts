import path from "path";
import { IRequest } from "@interfaces";
import {
  Logger,
  getErrorHandlerMiddleware,
  getLogReqMiddleware,
  getLoggerMiddleware,
} from "@s25digital/express-mw-logger";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import compression from "compression";
import cookieParser from "cookie-parser";
import Express, { json, NextFunction, Response } from "express";
import serveStatic from "serve-static";
import applyAuthMiddleware from "./auth";
import { DbMiddleware } from "./db";
import setupGraphQLProxy from "./graphql";
import { cspMiddleware, validateShop } from "./middlewares";
import SessionStorage from "./session";
import { setupWebhookRoute } from "./webhooks";

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

const app = Express();
app.set("top-level-oauth-cookie", "shopify_top_level_oauth");
app.set("use-online-tokens", true);

app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
app.use(getLoggerMiddleware({ name: "shopify-app-starter" }));
app.use(DbMiddleware);

applyAuthMiddleware(app);
setupWebhookRoute(app);

setupGraphQLProxy(app);

app.use(json());
app.use(cspMiddleware);
app.use(validateShop);

app.use(compression());
app.use(serveStatic(path.resolve(__dirname, "../client"), { index: ["index.html"] }));

app.use("*", (req: IRequest, res: Response, next: NextFunction) => {
  const shop = req.query.shop;
  const { shopInfo } = req;

  // Detect whether we need to reinstall the app
  // any request from Shopify will include a shop in the query parameters.
  if (shopInfo && shopInfo.isActive === false) {
    res.redirect(`/auth?shop=${shop}`);
    return;
  }

  if (shopInfo && shopInfo.shop !== shop) {
    res.redirect(`/auth?shop=${shop}`);
    return;
  }

  const appPath = path.resolve(__dirname, "../client");
  res.sendFile(path.join(appPath, "index.html"));
});
app.use(getLogReqMiddleware());
app.use(getErrorHandlerMiddleware());

export default app;
export const logger = Logger;
