import { IRequest } from "@interfaces";
import Shopify from "@shopify/shopify-api";
import { Response, NextFunction } from "express";

function CSPMiddleware(req: IRequest, res: Response, next: NextFunction) {
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
}

export default CSPMiddleware;
