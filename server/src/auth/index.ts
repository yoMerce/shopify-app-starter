import { IRequest } from "@interfaces";
import { Shopify } from "@shopify/shopify-api";
import { Application, Response, NextFunction } from "express";

import topLevelAuthRedirect from "./top-level-auth-redirect";

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
    next();
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

    next();
  });

  app.get("/auth/callback", async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(req, res, req.query as any);

      const host = req.query.host;
      app.set(
        "active-shopify-shops",
        Object.assign(app.get("active-shopify-shops"), {
          [session.shop]: session.scope,
        })
      );

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

      // Redirect to app with shop parameter upon auth
      res.redirect(`/?shop=${session.shop}&host=${host}`);
      next();
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
      next();
    }
  });
}
