//@ts-check
import Cryptr from "cryptr";
import Config from "../config";
import { Collections, getDbDriver } from "../db";

const cipher = new Cryptr(Config.DB.encryptionKey);

async function load(id) {
  const db = await getDbDriver();

  const collection = db.collection(Collections.Sessions);

  const doc = await collection.findOne({ _id: id });

  if (doc) {
    const data = cipher.decrypt(doc.data);
    const session = JSON.parse(data);

    return session;
  }

  return;
}

export default load;
