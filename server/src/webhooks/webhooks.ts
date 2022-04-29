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
  {
    topic: WebhookTopics.CUSTOMERS_DATA_REQUEST,
    route: "/gdpr/customers_data_request",
  },
  {
    topic: WebhookTopics.CUSTOMERS_REDACT,
    route: "/customers_redact",
  },
  {
    topic: WebhookTopics.SHOP_REDACT,
    route: "/shop_redact",
  },
];

export default webhooks;
