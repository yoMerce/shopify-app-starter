import Shopify, { SessionInterface } from "@shopify/shopify-api";

const storeSession = async (session: SessionInterface) => true;
const loadSession = async (id: string) => {
  const session: SessionInterface = {
    id: "",
    shop: "",
    state: "",
    isActive: () => true,
    isOnline: true,
  };

  return session;
};
const deleteSession = async (id: string) => true;

const SessionStorage = new Shopify.Session.CustomSessionStorage(storeSession, loadSession, deleteSession);

export default SessionStorage;
