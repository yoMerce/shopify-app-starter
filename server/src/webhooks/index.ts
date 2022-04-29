import { IRequest } from "@interfaces";
import { Logger } from "@s25digital/express-mw-logger";
import Shopify from "@shopify/shopify-api";
import { Application, NextFunction, Response } from "express";
import { Db } from "mongodb";
import { WebhookTopics } from "./enum";
import handlerMap, { getGDPRHandler } from "./handlers";
import webhooks, { IWebhookConfig } from "./webhooks";

interface IHandlerConfig {
  [key: string]: {
    path: string;
    webhookHandler: (topic: string, shop: string, body: string) => Promise<void>;
  };
}

export function setupWebhookRoute(app: Application) {
  webhooks.forEach((item: IWebhookConfig) => {
    app.post(`/webhooks${item.route}`, async (req: IRequest, res: Response, next: NextFunction) => {
      await Shopify.Webhooks.Registry.process(req, res);
      res.status(200).send();
      next();
    });
  });

  // these endpoints need to be setup in the app configuration in partner portal
  app.post("/webhooks/customer_data_request", getGDPRHandler(WebhookTopics.CUSTOMERS_DATA_REQUEST));
  app.post("/webhooks/customer_redact", getGDPRHandler(WebhookTopics.CUSTOMERS_REDACT));
  app.post("/webhooks/shop_redact", getGDPRHandler(WebhookTopics.SHOP_REDACT));
}

export async function setupWebhooks(shop: string, accessToken: string, logger: typeof Logger) {
  return await Promise.all(
    webhooks.map(async (item: IWebhookConfig) => {
      const res = await Shopify.Webhooks.Registry.register({
        path: `/webhooks${item.route}`,
        topic: item.topic,
        accessToken,
        shop,
      });

      if (res[item.topic].success) {
        logger.info({
          shop,
          message: `${item.topic} webhook registered successfuly`,
        });
      }

      return;
    })
  );
}

export function setupHandlers(db: Db, logger: typeof Logger) {
  const handlerConfig: IHandlerConfig = {};
  webhooks.forEach((item: IWebhookConfig) => {
    const getHandler = handlerMap.get(item.topic);
    handlerConfig[item.topic] = {
      path: item.route,
      webhookHandler: getHandler(db, logger),
    };
  });

  Shopify.Webhooks.Registry.addHandlers(handlerConfig);
}
