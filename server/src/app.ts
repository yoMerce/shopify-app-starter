import path from "path";
import { IRequest } from "@interfaces";
import {
  Logger,
  getErrorHandlerMiddleware,
  getLogReqMiddleware,
  getLoggerMiddleware,
} from "@s25digital/express-mw-logger";
import { Shopify } from "@shopify/shopify-api";
import compression from "compression";
import cookieParser from "cookie-parser";
import Express, { json, NextFunction, Response } from "express";
import serveStatic from "serve-static";
import applyAuthMiddleware from "./auth";
import { DbMiddleware } from "./db";
import setupGraphQLProxy from "./graphql";
import { cspMiddleware, validateShop } from "./middlewares";
import { setupWebhookRoute } from "./webhooks";

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

app.use("/*", (req: IRequest, res: Response, next: NextFunction) => {
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

  next();
});
app.use(getLogReqMiddleware());
app.use(getErrorHandlerMiddleware());

export default app;
export const logger = Logger;
