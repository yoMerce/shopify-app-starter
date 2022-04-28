import { IRequest } from "@interfaces";
import { Shopify } from "@shopify/shopify-api";
import { Application, Response, NextFunction } from "express";
import { Db } from "mongodb";
import { Collections } from "../db";

import topLevelAuthRedirect from "./top-level-auth-redirect";

async function updateShop(db: Db, shop: string) {
  const collection = db.collection(Collections.Shops);

  await collection.findOneAndUpdate(
    { shop },
    {
      $set: {
        isActive: true,
        modifiedOn: new Date(new Date().toISOString()),
      },
    }
  );
}

export default function applyAuthMiddleware(app: Application) {
  app.get("/auth", async (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop.toString(),
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req: IRequest, res: Response, next: NextFunction) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        shop: req.query.shop.toString(),
      })
    );
  });

  app.get("/auth/callback", async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(req, res, req.query as any);
      const db = req.db;

      const host = req.query.host;
      const { shop } = session;

      // mark shop as active
      await updateShop(db, shop);

      // register uninstall hook
      const response = await Shopify.Webhooks.Registry.register({
        shop: session.shop,
        accessToken: session.accessToken,
        topic: "APP_UNINSTALLED",
        path: "/webhooks",
      });

      if (!response["APP_UNINSTALLED"].success) {
        req.logger.info({
          message: `Failed to register APP_UNINSTALLED webhook: ${response.result}`,
        });
      }

      // Redirect to app once auth is complete
      res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e) {
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/auth?shop=${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
