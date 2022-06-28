import { Shopify } from "@shopify/shopify-api";
import { WebhookTopics } from "./enum";
import handlerMap, { getGDPRHandler } from "./handlers";
import webhooks from "./webhooks";

export function setupWebhookRoute(app) {
  webhooks.forEach((item) => {
    app.post(`/api/webhooks${item.route}`, async (req, res, next) => {
      await Shopify.Webhooks.Registry.process(req, res);
      res.status(200).send();
      next();
    });
  });

  // these endpoints need to be setup in the app configuration in partner portal
  app.post(
    "/api/webhooks/customer_data_request",
    getGDPRHandler(WebhookTopics.CUSTOMERS_DATA_REQUEST)
  );
  app.post(
    "/api/webhooks/customer_redact",
    getGDPRHandler(WebhookTopics.CUSTOMERS_REDACT)
  );
  app.post(
    "/api/webhooks/shop_redact",
    getGDPRHandler(WebhookTopics.SHOP_REDACT)
  );
}

export async function setupWebhooks(shop, accessToken, logger) {
  return await Promise.all(
    webhooks.map(async (item) => {
      const res = await Shopify.Webhooks.Registry.register({
        path: `/api/webhooks${item.route}`,
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

export function setupHandlers(db, logger) {
  const handlerConfig = {};
  webhooks.forEach((item) => {
    const getHandler = handlerMap.get(item.topic);
    handlerConfig[item.topic] = {
      path: item.route,
      webhookHandler: getHandler(db, logger),
    };
  });

  Shopify.Webhooks.Registry.addHandlers(handlerConfig);
}
