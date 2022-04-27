import path from "path";
import {
  Logger,
  getErrorHandlerMiddleware,
  getLogReqMiddleware,
  getLoggerMiddleware,
} from "@s25digital/express-mw-logger";
import { ApiVersion, Shopify } from "@shopify/shopify-api";
import compression from "compression";
import cookieParser from "cookie-parser";
import Express, { json } from "express";
import serveStatic from "serve-static";
import applyAuthMiddleware from "./auth";
import setupGraphQLProxy from "./graphql";
import { cspMiddleware, validateShop } from "./middlewares";
import SessionStorage from "./session";

const ACTIVE_SHOPIFY_SHOPS = {};

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

// register webhooks
// Shopify.Webhooks.Registry.addHandlers({
//   APP_UNINSTALLED: {
//     path: "/webhooks/app_uninstalled",
//     webhookHandler: () => {},
//   },
//   CUSTOMERS_DATA_REQUEST: {
//     path: "/webhooks/gdpr/customers_data_request",
//     webhookHandler: () => {},
//   },
//   CUSTOMERS_REDACT: {
//     path: "/webhooks/gdpr/customers_redact",
//     webhookHandler: () => {},
//   },
//   SHOP_REDACT: {
//     path: "/webhooks/gdpr/shop_redact",
//     webhookHandler: () => {},
//   },
// });

const app = Express();
app.set("top-level-oauth-cookie", "shopify_top_level_oauth");
app.set("use-online-tokens", true);
app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);

app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
app.use(getLoggerMiddleware({ name: "shopify-app-starter" }));

applyAuthMiddleware(app);

setupGraphQLProxy(app);

app.use(json());
app.use(cspMiddleware);
app.use(validateShop);

app.use(compression());
app.use(serveStatic(path.resolve(__dirname, "../client"), { index: ["index.html"] }));

app.use("/*", (req, res, next) => {
  // const shop = req.query.shop;

  // Detect whether we need to reinstall the app, any request from Shopify will
  // include a shop in the query parameters.
  // if (app.get("active-shopify-shops")[shop] === undefined && shop) {
  //   res.redirect(`/auth?shop=${shop}`);
  // } else {
  //   next();
  // }
  next();
});
app.use(getLogReqMiddleware());
app.use(getErrorHandlerMiddleware());

export default app;
export const logger = Logger;
