import { WebhookTopics } from "../enum";
import getAppUninstallHandler from "./app_uninstalled";
export { default as getGDPRHandler } from "./gdpr";

const handlerMap = new Map();

handlerMap.set(WebhookTopics.APP_UNINSTALLED, getAppUninstallHandler);

export default handlerMap;
