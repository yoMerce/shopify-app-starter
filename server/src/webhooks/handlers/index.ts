import { WebhookTopics } from "../enum";
import getAppUninstallHandler from "./app_uninstalled";
import getGDPRHandler from "./gdpr";

const handlerMap = new Map();

handlerMap
  .set(WebhookTopics.APP_UNINSTALLED, getAppUninstallHandler)
  .set(WebhookTopics.CUSTOMERS_DATA_REQUEST, getGDPRHandler)
  .set(WebhookTopics.CUSTOMERS_REDACT, getGDPRHandler)
  .set(WebhookTopics.SHOP_REDACT, getGDPRHandler);

export default handlerMap;
