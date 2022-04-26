import { SessionInterface } from "@shopify/shopify-api";
import Cryptr from "cryptr";
import Config from "../config";
import { Collections, getDbDriver } from "../db";

const cipher = new Cryptr(Config.DB.encryptionKey);

async function load(id: string) {
  const db = await getDbDriver();

  const collection = db.collection(Collections.Sessions);

  const doc = await collection.findOne({ id });

  if (doc) {
    const data = cipher.decrypt(doc.data);
    const session: SessionInterface = JSON.parse(data);

    return session;
  }

  return;
}

export default load;
