import path from "path";
import * as fs from "fs";
import Express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import cookieParser from "cookie-parser";
import { ApiVersion, Shopify } from "@shopify/shopify-api";
import SessionStorage from "./sessions";
import applyAuthMiddleware from "./auth";
import { verifyRequest } from "./middlewares";

const ACTIVE_SHOPIFY_SHOPS = {};

// connect mongodb

// Initialize shopify context
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: (process.env.SHOPIFY_API_SCOPES || "").split(","),
  HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // SESSION_STORAGE: SessionStorage,
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

applyAuthMiddleware(app);

// Graphql proxy for Shopify
// app.post("/graphql", verifyRequest(app), async (req, res) => {
//   try {
//     const response = await Shopify.Utils.graphqlProxy(req, res);
//     res.status(200).send(response.body);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });
app.use(Express.json());
app.use((req, res, next) => {
  const shop = req.query.shop;
  if (Shopify.Context.IS_EMBEDDED_APP && shop) {
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com;`
    );
  } else {
    res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
  }
  next();
});

app.use(compression());
app.use(serveStatic(path.resolve(__dirname, "../client"), { index: ["index.html"] }));

app.use("/*", (req, res, next) => {
  const shop = req.query.shop;
  console.log(shop);

  // Detect whether we need to reinstall the app, any request from Shopify will
  // include a shop in the query parameters.
  // if (app.get("active-shopify-shops")[shop] === undefined && shop) {
  //   res.redirect(`/auth?shop=${shop}`);
  // } else {
  //   next();
  // }
  next();
});

export default app;
