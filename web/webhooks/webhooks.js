import { WebhookTopics } from "./enum";

const webhooks = [
  {
    topic: WebhookTopics.APP_UNINSTALLED,
    route: "/app_uninstalled",
  },
];

export default webhooks;
