import path from "path";
import Express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import cookieParser from "cookie-parser";
import { Shopify } from "@shopify/shopify-api";

// add session storage

// connect mongodb

// Initialize shopify context
// Shopify.Context.initialize({
//   API_KEY: process.env.SHOPIFY_API_KEY,
//   API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
//   SCOPES: process.env.SHOPIFY_API_SCOPES,
//   HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
//   API_VERSION: process.env.SHOPIFY_API_VERSION,
//   IS_EMBEDDED_APP: true,
//   SESSION_STORAGE: sessionStorage,
// });

// register webhooks
// Shopify.Webhooks.Registry.addHandlers({
//   APP_UNINSTALLED: {
//     path: "/webhooks/app_uninstalled",
//     webhookHandler: () => {},
//   },
//   CUSTOMERS_DATA_REQUEST: {
//     path: "/webhooks/gdpr/customers_data_request",
//     webhookHandler: () => {},
//   },
//   CUSTOMERS_REDACT: {
//     path: "/webhooks/gdpr/customers_redact",
//     webhookHandler: () => {},
//   },
//   SHOP_REDACT: {
//     path: "/webhooks/gdpr/shop_redact",
//     webhookHandler: () => {},
//   },
// });

const app = Express();
// app.set("top-level-oauth-cookie", "shopify_top_level_oauth");
app.set("use-online-tokens", true);

app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

// add auth middleware

//app.use("/webhooks", webhookRoutes); //webhookRotues

// Graphql proxy for Shopify
// app.post("/graphql", verifyRequest(app), async (req, res) => {
//   try {
//     const response = await Shopify.Utils.graphqlProxy(req, res);
//     res.status(200).send(response.body);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });
app.use(Express.json());
app.use(compression());
app.use(Express.static(path.resolve(__dirname, "../client")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "index.html"));
// });

// app.use("/", userRoutes);

export default app;
