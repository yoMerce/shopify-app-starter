import { IRequest } from "@interfaces";
import { Logger } from "@s25digital/express-mw-logger";
import Shopify from "@shopify/shopify-api";
import { Application, Response } from "express";
import { Db } from "mongodb";
import handlerMap from "./handlers";
import webhooks, { IWebhookConfig } from "./webhooks";

interface IHandlerConfig {
  [key: string]: {
    path: string;
    webhookHandler: (topic: string, shop: string, body: string) => Promise<void>;
  };
}

export function setupWebhookRoute(app: Application) {
  webhooks.forEach((item: IWebhookConfig) => {
    app.post(`/webhooks${item.route}`, async (req: IRequest, res: Response) => {
      await Shopify.Webhooks.Registry.process(req, res);
    });
  });
}

export async function setupWebhooks(shop: string, accessToken: string, logger: typeof Logger) {
  await Promise.all(
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
    handlerConfig[item.topic] = {
      path: item.route,
      webhookHandler: handlerMap.get(item.topic)(db, logger),
    };
  });

  Shopify.Webhooks.Registry.addHandlers(handlerConfig);
}
