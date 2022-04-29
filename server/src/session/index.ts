import Shopify from "@shopify/shopify-api";
import deleteSession from "./delete";
import loadSession from "./load";
import storeSession from "./store";

const SessionStorage = new Shopify.Session.CustomSessionStorage(
  storeSession,
  loadSession,
  deleteSession
);

export default SessionStorage;
