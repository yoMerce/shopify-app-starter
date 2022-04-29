import { WebhookTopics } from "./enum";

export interface IWebhookConfig {
  topic: keyof typeof WebhookTopics;
  route: string;
}

const webhooks: IWebhookConfig[] = [
  {
    topic: WebhookTopics.APP_UNINSTALLED,
    route: "/app_uninstalled",
  },
];

export default webhooks;
